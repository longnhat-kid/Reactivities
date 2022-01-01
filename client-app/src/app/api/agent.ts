import axios, {AxiosResponse, AxiosError} from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity } from '../models/activity';
import { stores } from '../stores/stores';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.interceptors.response.use(async response => {
    await sleep(2000);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    console.log(error.response);
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
            toast.error('unauthorized');
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

const requests = {
    activityList: () => actions.get<Activity[]>('/activities'),
    activityDetails: (id: string) => actions.get<Activity>(`/activities/${id}`),
    createActivity: (activity: Activity) => actions.post<void>('/activities', activity),
    updateActivity: (activity: Activity) => actions.put<void>(`/activities/${activity.id}`, activity),
    deleteActivity: (id: string) => actions.delete<void>(`/activities/${id}`)
}

const agent = {
    requests
}

export default agent