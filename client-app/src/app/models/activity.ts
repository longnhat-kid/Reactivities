import { Profile } from "./profile";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUserName: string;
    host?: Profile;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    attendees: Profile[]
}

export class Activity implements Activity{
    constructor(init: ActivityFormValues){
        Object.assign(this, init);
    }
}

export class ActivityFormValues{
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    city: string = '';
    venue: string = ''; 
    date: Date | null = null;

    constructor(activity?: Activity) {
        Object.assign(this, activity);
    }
}