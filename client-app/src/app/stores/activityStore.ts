import {makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';
import { format } from "date-fns";
import { stores } from "./stores";
import { Profiles } from "../models/profiles";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    isLoading: boolean = true;
    isSubmitting: boolean = false; 
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor(){
        makeAutoObservable(this)

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    setPredicate = (key: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        if(['all', 'isGoing', 'isHost'].includes(key)){
            resetPredicate();
            this.predicate.set(key, true);
        }
        if(key === 'startDate'){
            this.predicate.delete('startDate');
            this.predicate.set('startDate', value);
        }
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    get axiosPagingParams(){
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());

        this.predicate.forEach((value, key) => {
            if(key === 'startDate'){
                params.append(key, (value as Date).toISOString());
            }
            else{
                params.append(key, value);
            }
        })

        return params;
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity] 
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.isLoading = true;
        try {
            const result = await agent.activities.activityList(this.axiosPagingParams);
            result.data.forEach(activity => {
                this.setActivity(activity);
            })
            this.setPagination(result.pagination);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.isLoading = false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    private setActivity = (activity: Activity) => {
        const user = stores.userStore.user;
        if(user){
            activity.isGoing = activity.attendees?.some(attendee => attendee.userName === user.userName);
            activity.isHost = activity.hostUserName === user.userName;
        }
        activity.host = activity.attendees?.find(attendee => attendee.userName === activity.hostUserName);
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    loadActivityDetail = async (id: string) => {
        var activity = this.activityRegistry.get(id);
        if(activity) {
            this.selectActivity(activity);
            return activity;
        }
        var data = await agent.activities.activityDetails(id);
        this.setActivity(data);
        this.selectActivity(data);
        return data;
    }

    selectActivity = (activity: Activity) => {
        this.selectedActivity = activity;
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    submitActivity = async (activity: ActivityFormValues) => {
        const user = stores.userStore.user;
        var newActivity = new Activity(activity);
        if(activity.id){
            await agent.activities.updateActivity(newActivity);
            let updateActivity = {...this.activityRegistry.get(activity.id), ...activity};
            this.activityRegistry.set(updateActivity.id!, updateActivity as Activity);
            this.selectActivity(updateActivity as Activity);
            return;
        }
        else{
            newActivity.id = uuid();
            await agent.activities.createActivity(newActivity);
            var attendee = new Profiles(user!);
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            this.selectActivity(newActivity);
            return;
        }
    }

    deleteActivity = (id: string) => {
        runInAction(() =>{
            this.isSubmitting = true;
        })
        agent.activities.deleteActivity(id).then(() => {
            runInAction(() =>{
                this.activityRegistry.delete(id);
                this.isSubmitting = false;
            })
        })
    }

    updateAttendance = async (id: string) => {
        const user = stores.userStore.user;
        runInAction(() => this.isSubmitting = true);
        try {
            await agent.activities.updateAttend(id);
            if(this.selectedActivity?.isGoing){
                runInAction(() => {
                    this.selectedActivity!.attendees = this.selectedActivity!.attendees?.filter(a => a.userName !== user?.userName);
                    this.selectedActivity!.isGoing = false
                });
            }
            else{
                var attendee = new Profiles(user!);
                runInAction(() => {
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true
                });
            }
            runInAction(() => this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!));
        } catch (error) {
            console.log(error);
        } finally{
            runInAction(() => this.isSubmitting = false);
        }
    }

    cancelActivityToggle = async () => {
        this.isSubmitting = true;
        try {
            await agent.activities.updateAttend(this.selectedActivity!.id);
            runInAction(() =>{
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.isSubmitting = false);
        }
    }

    updateAttendeeFollow = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if(attendee.userName === username){
                    attendee.isFollowing ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.isFollowing = !attendee.isFollowing;
                }
            })
        })
    }
}