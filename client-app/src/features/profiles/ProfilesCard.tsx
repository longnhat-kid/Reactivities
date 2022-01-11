import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import {Card, Icon, Image} from 'semantic-ui-react';
import { Profiles } from '../../app/models/profiles';
import useStores from '../../app/stores/stores';
import FollowButton from './FollowButton';

interface Props {
    profiles: Profiles;
}

export default observer(function ProfilesCard({profiles}: Props){

    const {userStore} = useStores();

    return (
        <Card as={Link} to={`/profiles/${profiles.userName}`} color={profiles.isFollowing ? 'orange': 'grey'}>
            <Card.Content>
                <Image size='mini' floated='right' wrapped ui={true} src={profiles.mainPhoto || '/assets/user.png'}/>
                <Card.Header>{profiles.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                {profiles.followersCount} followers
            </Card.Content>
            {profiles.userName !== userStore.user!.userName && (
                <Card.Content extra>
                    <FollowButton profiles={profiles} />
                </Card.Content>
            )}
        </Card>
    )
})