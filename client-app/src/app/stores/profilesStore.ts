import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profiles } from "../models/profiles";
import { stores } from "./stores";

export default class ProfilesStore{
    profiles: Profiles | null = null;
    isLoading: boolean = false;
    isUpload: boolean = false;
    isSetMain: boolean = false;
    isDeleting: boolean = false

    constructor(){
        makeAutoObservable(this);
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
}