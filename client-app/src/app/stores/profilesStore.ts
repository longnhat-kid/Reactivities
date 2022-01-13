import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { UserActivity } from "../models/activity";
import { Photo, Profiles } from "../models/profiles";
import { stores } from "./stores";

export default class ProfilesStore{
    profiles: Profiles | null = null;
    follows: Profiles[] = []; 
    activityRegistry = new Map<string, UserActivity>();
    isLoading: boolean = false;
    isUpload: boolean = false;
    isSetMain: boolean = false;
    isDeleting: boolean = false;
    isFollowing: boolean = false;
    loadingFollows: boolean = false;
    loadingUserActivities: boolean = false;
    activeTab: number = 0;
    activeEventMenu: string = 'future';

    constructor(){
        makeAutoObservable(this);
        
        reaction(
            () => this.activeTab,
            (activeTab) => {
                if(activeTab === 3 || activeTab === 4){
                    const predicate = activeTab === 3 ? 'followers' : 'followings';
                    this.loadListFollows(predicate);
                }
                if(activeTab === 2){
                    this.activityRegistry.clear();
                    this.loadUserActivities(this.activeEventMenu);
                }
                else{
                    this.activityRegistry.clear();
                    this.follows = [];
                }
            }
        )

        reaction(
            () => this.activeEventMenu,
            (activeEventMenu) => {
                this.activityRegistry.clear();
                this.loadUserActivities(activeEventMenu);
            }
        )
    }

    setActiveEventMenu = (activeMenu: string) => {
        this.activeEventMenu = activeMenu;
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    loadUserActivities = async (predicate: string) => {
        this.loadingUserActivities = true;
        this.activityRegistry.clear();
        try {
            var result = await agent.profiles.loadUserActivities(this.profiles!.userName, predicate);
            runInAction(() =>{
                result.forEach(activity => {
                    activity.date = new Date(activity.date!);
                    runInAction(() =>{
                        this.activityRegistry.set(activity.id, activity);
                    })
                });
            })
            
        } catch (error) {
            console.log(error);
        } finally{
            runInAction(() =>  this.loadingUserActivities = false);
        }
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser(){
        if(stores.userStore.user && this.profiles){
            return stores.userStore.user.userName === this.profiles.userName;
        }
        return false;
    }

    getProfiles = async (username: string) => {
        this.isLoading = true
        try {
            var profiles = await agent.profiles.get(username);
            runInAction(() =>this.profiles = profiles)
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() =>this.isLoading = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.isUpload = true;
        try {
            var response = await agent.profiles.uploadPhoto(file);
            var photo = response.data;
            runInAction(() =>{
                if(this.profiles){
                    this.profiles.photos.push(photo);
                    if(photo.isMain && stores.userStore.user){
                        stores.userStore.setPhoto(photo.url);
                        this.profiles.mainPhoto = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() =>this.isUpload = false)
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.isSetMain = true;
        try {
            await agent.profiles.setMainPhoto(photo.id);
            stores.userStore.setPhoto(photo.url)
            runInAction(() =>{
                if(this.profiles){
                    this.profiles.photos.find(p => p.isMain)!.isMain = false;
                    this.profiles.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profiles.mainPhoto = photo.url;
                }
            })
            
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() =>this.isSetMain = false)
        }
    }

    deletePhoto = async (id: string) => {
        this.isDeleting = true;
        try {
            await agent.profiles.deletePhoto(id);
            runInAction(() => {
                if(this.profiles){
                    this.profiles!.photos = this.profiles!.photos.filter(p => p.id !== id);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() =>this.isDeleting = false)
        }
    }

    updateFollowing = async (userName: string, following: boolean) => {
        this.isFollowing = true
        try {
            await agent.profiles.updateFollow(userName);
            stores.activityStore.updateAttendeeFollow(userName);
            runInAction(() => {
                if(this.profiles && this.profiles.userName !== stores.userStore.user?.userName && this.profiles.userName === userName){
                    following ? this.profiles.followersCount++ : this.profiles.followersCount--;
                    this.profiles.isFollowing = !this.profiles.isFollowing;
                }
                if(this.profiles && this.profiles.userName === stores.userStore.user?.userName){
                    following ? this.profiles.followingsCount++ : this.profiles.followingsCount--;
                }
                this.follows.forEach(follow => {
                    if(follow.userName === userName) {
                        follow.isFollowing ? follow.followersCount-- : follow.followersCount++;
                        follow.isFollowing = !follow.isFollowing;
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.isFollowing = false)
        }
    }

    loadListFollows = async (predicate: string) => {
        this.loadingFollows = true;
        try {
            var follows = await agent.profiles.loadListFollows(this.profiles!.userName, predicate);
            runInAction(() => this.follows = follows)
        } catch (error) {
            console.log(error);
        } finally{
            runInAction(() => this.loadingFollows = false)
        }
    }
}