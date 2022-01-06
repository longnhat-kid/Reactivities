import { User } from "./user";

export interface Profile{
    displayName:string;
    userName: string;
    image?:string;
    bio?: string
}

export class Profile implements Profile {
    constructor(user: User){
        this.displayName = user.displayName;
        this.userName = user.userName;
        this.image = user.image;
    }
}