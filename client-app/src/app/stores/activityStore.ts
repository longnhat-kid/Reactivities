import {makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    submitting = false;

    constructor(){
        makeAutoObservable(this)
    }

    getActivitiesByDateTime = () => {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = () => {
        try {
            agent.requests.activityList().then(data => {
                data.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    runInAction(()=>{
                        this.activityRegistry.set(activity.id, activity);
                    })
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
            var data = await agent.requests.activityDetails(id);
            data.date = data.date.split('T')[0];
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
        this.submitting = true;
        if(activity.id){
            await agent.requests.updateActivity(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectActivity(activity);
            runInAction(() =>{
                this.submitting = false;
            })
            return;
        }
        else{
            activity.id = uuid();
            await agent.requests.createActivity(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectActivity(activity);
            runInAction(() =>{
                this.submitting = false;
            })
            return;
        }
    }

    deleteActivity = (id: string) => {
        runInAction(() =>{
            this.submitting = true;
        })
        agent.requests.deleteActivity(id).then(() => {
            runInAction(() =>{
                this.activityRegistry.delete(id);
                this.submitting = false;
            })
        })
    }
}