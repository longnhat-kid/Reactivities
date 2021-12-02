import axios, {AxiosResponse} from 'axios';
import { Activity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}

axios.interceptors.response.use(async response => {
    try {
        await sleep(2000);
        return response;
    } catch (error) {
        console.error(error);
        return await Promise.reject(error);
    }
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