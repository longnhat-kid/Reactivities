import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import useStores from '../../../app/stores/stores';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard(){
    const {activityStore} = useStores();

    useEffect(() =>{
        activityStore.loadActivities();
    }, [activityStore])

  if(activityStore.isLoading) return <Loading content = 'Loading activities...'/>
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters/>
            </Grid.Column>
        </Grid>
    )
})