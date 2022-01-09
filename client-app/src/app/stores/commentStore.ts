import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import UserComment from "../models/comment";
import { stores } from "./stores";

export default class CommentStore{
    comments: UserComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this)
    }

    createHubConnection = (activityId: string) => {
        if(stores.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`http://localhost:5000/comment?activityId=${activityId}`, {
                    accessTokenFactory: () => stores.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the hub connection: ', error));

            this.hubConnection.on('LoadComments', (comments: UserComment[]) => {
                runInAction(() => {
                    this.comments = comments.map(comment => {
                        comment.createAt = new Date(comment.createAt + 'Z');
                        return comment;
                    });
                });
            })

            this.hubConnection.on('ReceiveComment', (comment: UserComment) => {
                comment.createAt = new Date(comment.createAt);
                runInAction(() => this.comments.unshift(comment));
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping the hub connection', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    sendComment = async (comment: any) => {
        comment.activityId = stores.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', comment);
        } catch (error) {
            console.log('error');
        }
    }
}