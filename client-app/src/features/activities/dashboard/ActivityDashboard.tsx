import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import useStores from '../../../app/stores/stores';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard(){
    const {activityStore} = useStores();
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                { 
                    activityStore.selectedActivity && !activityStore.editMode &&
                    <ActivityDetails />
                }
                {
                    activityStore.editMode &&
                    <ActivityForm />
                }
            </Grid.Column>
        </Grid>
    )
})