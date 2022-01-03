import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserForm } from "../models/user";
import { stores } from "./stores";

export default class UserStore{
    user: User | null = null

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
}