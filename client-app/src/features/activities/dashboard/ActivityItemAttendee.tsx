import { observer } from 'mobx-react-lite';
import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { Profiles } from '../../../app/models/profiles';
import ProfileCard from '../../profiles/ProfilesCard';

interface Props {
    attendees: Profiles[];
}

export default observer(function ActivityItemAttendee({attendees}: Props){
    const styles = {
        borderColor: 'orange',
        borderWidth: 3,
        cursor: 'pointer'
    }

    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger = {
                        <List.Item key={attendee.userName}>
                            <Image 
                                size='mini' 
                                circular 
                                src={attendee.mainPhoto || '/assets/user.png'}
                                bordered
                                style={attendee.isFollowing ? styles : {cursor: 'pointer'}}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profiles={attendee}/>
                    </Popup.Content>
                </Popup>
                
            ))}
        </List>
    )
})