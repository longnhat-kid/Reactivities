import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import useStores from '../../../app/stores/stores';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props{
    submitActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default observer(function ActivityDashboard({submitActivity, deleteActivity, submitting}: Props){
    const {activityStore} = useStores();
    return(
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                { 
                    activityStore.selectedActivity && !activityStore.editMode &&
                    <ActivityDetails />
                }
                {
                    activityStore.editMode &&
                    <ActivityForm 
                        submitActivity={submitActivity}
                        submitting={submitting}
                    />
                }
            </Grid.Column>
        </Grid>
    )
})