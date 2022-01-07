import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profiles } from '../../app/models/profiles';

interface Props {
    profiles: Profiles;
}

export default function ProfilesCard({profiles}: Props){
    return (
        <Card as={Link} to={`/profiles/${profiles.userName}`}>
            <Image size='medium' wrapped ui={true} src={profiles.mainPhoto || '/assets/user.png'}/>
            <Card.Content>
                <Card.Header>{profiles.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                20 followers
            </Card.Content>
        </Card>
    )
}