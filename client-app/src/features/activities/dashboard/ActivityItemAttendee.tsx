import { observer } from 'mobx-react-lite';
import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityItemAttendee({attendees}: Props){
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger = {
                        <List.Item key={attendee.userName}>
                            <Image size='mini' circular src={attendee.image || '/assets/user.png'}/>
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>
                
            ))}
        </List>
    )
})