import axios, {AxiosResponse, AxiosError} from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues, UserActivity } from '../models/activity';
import { PaginatedResult } from '../models/pagination';
import { Photo, Profiles } from '../models/profiles';
import { User, UserForm } from '../models/user';
import { stores } from '../stores/stores';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.interceptors.request.use(config => {
    if(stores.commonStore.token){
        config.headers!.Authorization = `Bearer ${stores.commonStore.token}`; 
    }
    return config;
})

axios.interceptors.response.use(async response => {
    if(process.env.NODE_ENV === 'development') await sleep(2000);
    
    var pagination = response.headers["pagination"];
    if(pagination){
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch (status) {
        case 400:
            if(typeof data === 'string') {
                toast.error(data);
            }
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                history.push('not-found');
            }
            if(data.errors){
                var modelStateErrors = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }
            break;
        case 401:
            //toast.error('unauthorized');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            stores.commonStore.setServerError(data);
            history.push('/server-error');
            break;
        default:
            break;
    }
    return Promise.reject(error);
})

const actions = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const activities = {
    activityList: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params}).then(responseBody),
    activityDetails: (id: string) => actions.get<Activity>(`/activities/${id}`),
    createActivity: (activity: ActivityFormValues) => actions.post<void>('/activities', activity),
    updateActivity: (activity: ActivityFormValues) => actions.put<void>(`/activities/${activity.id}`, activity),
    deleteActivity: (id: string) => actions.delete<void>(`/activities/${id}`),
    updateAttend: (id: string) => actions.post<void>(`/activities/${id}/attend`, {})
}

const users = {
    current: () => actions.get<User>('/account'),
    login: (user: UserForm) => actions.post<User>('account/login', user),
    register: (user: UserForm) => actions.post<User>('account/register', user)
}

const profiles = {
    get: (username: string) => actions.get<Profiles>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });
    },
    setMainPhoto: (id: string) => actions.put(`/photos/main/${id}`, {}),
    deletePhoto: (id: string) => actions.delete(`/photos/${id}`),
    updateFollow: (username: string) => actions.put(`/follow/${username}`, {}),
    loadListFollows: (username: string, predicate: string) => actions.get<Profiles[]>(`/follow/${username}?predicate=${predicate}`),
    loadUserActivities: (username: string, predicate: string) => actions.get<UserActivity[]>(`/profiles/${username}/activities/?predicate=${predicate}`)
}

const agent = {
    activities,
    users,
    profiles
}

export default agent