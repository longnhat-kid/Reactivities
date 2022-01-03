import {makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';
import { format } from "date-fns";

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
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
        try {
            const activities = await agent.activities.activityList();
            activities.forEach(activity => {
                activity.date = new Date(activity.date!);
                runInAction(()=>{
                    this.activityRegistry.set(activity.id, activity);
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    loadActivityDetail = async (id: string) => {
        var activity = this.activityRegistry.get(id);
        if(activity){
            this.selectActivity(activity);
            return activity;
        }
        else{
            var data = await agent.activities.activityDetails(id);
            data.date = new Date(data.date!);
            this.selectActivity(data);
            return data;
        }
    }

    selectActivity = (activity: Activity) => {
        this.selectedActivity = activity;
    }

    cancelSelectActivity = () => {
        runInAction(() => {
            this.selectedActivity = undefined;
        })
    }

    submitActivity = async (activity: Activity) => {
        if(activity.id){
            await agent.activities.updateActivity(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectActivity(activity);
            return;
        }
        else{
            activity.id = uuid();
            await agent.activities.createActivity(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectActivity(activity);
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
}