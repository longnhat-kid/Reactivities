import { User } from "./user";

export interface Profiles{
    displayName:string;
    userName: string;
    mainPhoto?:string;
    bio?: string;
    photos: Photo[];
    isFollowing: boolean;
    followersCount: number;
    followingsCount: number
}

export class Profiles implements Profiles {
    constructor(user: User){
        this.displayName = user.displayName;
        this.userName = user.userName;
        this.mainPhoto = user.mainPhoto;
    }
}

export interface Photo{
    id: string;
    url: string;
    isMain: boolean;
}