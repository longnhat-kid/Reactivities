import { observer } from 'mobx-react-lite';
import React from 'react';
import {Divider, Grid, Header, Item, Segment, Statistic } from 'semantic-ui-react';
import { Profiles } from '../../app/models/profiles';
import FollowButton from './FollowButton';

interface Props {
    profiles: Profiles | null;
}

export default observer(function ProfileHeader({profiles}: Props){
    
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profiles?.mainPhoto || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profiles?.displayName}/>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profiles?.followersCount}/>
                        <Statistic label='Following' value={profiles?.followingsCount}/>
                    </Statistic.Group>
                    <Divider/>
                    {profiles && (
                        <FollowButton profiles={profiles} />
                    )}
                </Grid.Column>
            </Grid>
        </Segment>
    )
})