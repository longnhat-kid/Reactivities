import {makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';
import { format } from "date-fns";
import { stores } from "./stores";
import { Profiles } from "../models/profiles";

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    isLoading: boolean = true;
    isSubmitting: boolean = false; 

    constructor(){
        makeAutoObservable(this)
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
            const activities = await agent.activities.activityList();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.isLoading = false);
        }
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
}