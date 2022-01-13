import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import {Card, Image} from 'semantic-ui-react';
import { UserActivity } from '../../app/models/activity';

interface Props {
    activity: UserActivity;
}

export default observer(function ProfilesEventCard({activity}: Props){

    return (
        <Card as={Link} to={`/details/${activity.id}`}>
            <Image size='massive' wrapped ui={true} src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header textAlign='center'>{activity.title}</Card.Header>
                <Card.Meta textAlign='center'>
                    <span className='date'>{format(activity.date!, 'dd MMM yyyy')}</span>
                </Card.Meta>
                <Card.Meta textAlign='center'>
                    <span className='date'>{format(activity.date!, 'h:mm aa')}</span>
                </Card.Meta>
            </Card.Content>
        </Card>
    )
})