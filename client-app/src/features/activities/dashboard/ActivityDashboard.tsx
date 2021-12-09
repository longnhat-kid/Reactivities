import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import useStores from '../../../app/stores/stores';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard(){
    const {activityStore} = useStores();

    useEffect(() =>{
        activityStore.loadActivities();
    }, [activityStore])

  if(!activityStore.activityRegistry.size) return <Loading/>
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <Header as='h2'>
                    Activity Filter
                </Header>
            </Grid.Column>
        </Grid>
    )
})