import { action, makeAutoObservable, observable } from "mobx";
import { Activity } from "../models/activity";
import agent from '../api/agent';

export default class ActivityStore{

    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    loadingInit = false; 
    editMode = false;

    constructor(){
        makeAutoObservable(this)
    }

    loadActivities = () => {
        this.setLoadingInit(true);
        try {
            agent.requests.activityList().then(data => {
                this.activities = data
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
        this.selectedActivity = this.activities.find(x => x.id === id);
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
}