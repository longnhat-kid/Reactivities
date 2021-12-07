import {makeAutoObservable } from "mobx";
import { Activity } from "../models/activity";
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    loadingInit = true; 
    editMode = false;
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
                    this.activityRegistry.set(activity.id, activity);
                })
                this.setLoadingInit(false);
            })
        } catch (error) {
            console.log(error);
            this.setLoadingInit(false);
        }
    }

    setLoadingInit = (state: boolean) => {
        this.loadingInit = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    submitActivity = (activity: Activity) => {
        this.submitting = true;
        if(activity.id){
            agent.requests.updateActivity(activity).then(() => {
              this.activityRegistry.set(activity.id, activity);
              this.submitting = false;
              this.editMode = false;
              this.selectActivity(activity.id);
            })
        }
          else{
            activity.id = uuid();
            agent.requests.createActivity(activity).then(() => {
              this.activityRegistry.set(activity.id, activity);
              this.submitting = false;
              this.editMode = false;
              this.selectActivity(activity.id);
            })
        }
    }

    deleteActivity = (id: string) => {
        this.submitting = true;
        agent.requests.deleteActivity(id).then(() => {
            this.activityRegistry.delete(id);
            this.submitting = false;
            if(this.selectedActivity?.id === id) this.cancelSelectActivity();
        })
    }
}