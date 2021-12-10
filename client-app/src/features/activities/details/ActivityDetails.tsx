import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import {useParams } from 'react-router-dom';
import {Grid} from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import useStores from '../../../app/stores/stores';
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';


export default observer(function ActivityDetails(){
    const {activityStore} = useStores();
    const {selectedActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    useEffect(()=> {activityStore.loadActivityDetail(id)},[activityStore, id]);

    if(!selectedActivity) return <Loading content = 'Loading select activity...'/>

    return(
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailsHeader activity={selectedActivity!} />
                <ActivityDetailsInfo activity={selectedActivity!} />
                <ActivityDetailsChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailsSidebar />
            </Grid.Column>
        </Grid>
    )
})