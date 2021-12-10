import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import {Header } from 'semantic-ui-react';
import useStores from '../../../app/stores/stores';
import ActivityItem from './ActivityItem';

export default observer(function ActivityList(){
    const {activityStore} = useStores();
    return(
        <>
            {activityStore.groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity}/>
                    ))}
                </Fragment>
            ))}
        </>
    )
})