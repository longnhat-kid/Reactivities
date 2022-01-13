import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab, Grid, Header, Card, Loader, Dimmer } from 'semantic-ui-react';
import useStores from '../../app/stores/stores';
import ProfilesEventCard from './ProfilesEventCard';
import ProfilesEventsMenu from './ProfilesEventsMenu';

export default observer(function ProfilesEvents(){
    const {profilesStore} = useStores();
    const {activitiesByDate, loadingUserActivities} = profilesStore;

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='playstation' content='Activities'/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <ProfilesEventsMenu />
                </Grid.Column>
                <Grid.Column width={16}>
                    {loadingUserActivities ? (
                        <Dimmer active inverted style={{marginTop: 25}}>
                            <Loader size='medium' inverted content='Loading activities...'/>
                        </Dimmer>
                    ) : (
                        <Card.Group itemsPerRow={4}>
                            {activitiesByDate.map(activity => (
                                <ProfilesEventCard key={activity.id} activity = {activity} />
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})