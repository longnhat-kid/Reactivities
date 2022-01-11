import { observer } from 'mobx-react-lite';
import React from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import useStores from '../../app/stores/stores';
import ProfilesCard from './ProfilesCard';

export default observer(function ProfilesFollows(){

    const {profilesStore} = useStores();
    const {loadingFollows, follows, profiles, activeTab} = profilesStore;

    return (
        <Tab.Pane loading={loadingFollows}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated='left' 
                        icon='user' 
                        content={activeTab === 3 ? `People following ${profiles?.displayName}` : `People ${profiles?.displayName} is following`}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {follows.map(follow => (
                            <ProfilesCard key={follow.userName} profiles={follow} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})