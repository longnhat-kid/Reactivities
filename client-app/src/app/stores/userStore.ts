import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserForm } from "../models/user";
import { stores } from "./stores";

export default class UserStore{
    user: User | null = null;
    fbAccessToken: string | null = null;
    fbLoading: boolean = false;

    constructor(){
        makeAutoObservable(this)
    }

    get isLoggedIn(){
        return !!this.user;
    }

    login = async (user: UserForm) => {
        try {
            const result = await agent.users.login(user);
            stores.commonStore.setToken(result.token);
            runInAction(() => this.user = result);
            history.push('/activities');
            stores.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    register = async (user: UserForm) => {
        try {
            const result = await agent.users.register(user);
            stores.commonStore.setToken(result.token);
            runInAction(() => this.user = result);
            history.push('/activities');
            stores.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        stores.commonStore.setToken(null);
        runInAction(() => this.user = null);
        history.push('/');
    }

    getCurrentUser = async () => {
        try {
            const user = await agent.users.current();
            runInAction(() => this.user = user)
        } catch (error) {
            console.log(error);
        }
    }

    setPhoto = (photoUrl: string) => {
        this.user!.mainPhoto = photoUrl;
    }

    getFacebookLoginStatus = async () => {
        window.FB.getLoginStatus(response => {
            if(response.status === 'connected'){
                this.fbAccessToken = response.authResponse.accessToken;
            }
        })
    }

    facebookLogin = () => {
        this.fbLoading = true;
        const apiLogin = (accessToken: string) => {
            agent.users.fbLogin(accessToken).then(user => {
                stores.commonStore.setToken(user.token);
                runInAction(() => {
                    this.user = user;
                });
                history.push('/activities');
            }).catch(error => 
                console.log(error)
            ).finally(() => {
                runInAction(() => this.fbLoading = false)
            })
        }

        if(this.fbAccessToken){
            apiLogin(this.fbAccessToken)
        }
        else{
            window.FB.login(response => 
                apiLogin(response.authResponse.accessToken),
            {scope: 'public_profile,email'})
        }
    }
}