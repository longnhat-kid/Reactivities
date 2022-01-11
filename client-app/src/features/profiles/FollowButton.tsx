import { observer } from 'mobx-react-lite';
import { SyntheticEvent } from 'react';
import { Reveal, Button } from 'semantic-ui-react';
import { Profiles } from '../../app/models/profiles';
import useStores from '../../app/stores/stores';

interface Props {
    profiles: Profiles;
}

export default observer(function FollowButton({profiles}: Props){
    const {profilesStore: {updateFollowing, isFollowing}, userStore} = useStores();

    if(userStore.user?.userName === profiles.userName) return null;

    function handleFollow(e: SyntheticEvent ,username: string){
        e.preventDefault();
        updateFollowing(username, !profiles.isFollowing);
    }

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{width: '100%'}}>
                <Button 
                    fluid 
                    color='teal' 
                    content={profiles.isFollowing ? 'Following' : 'Not follow'}/>
            </Reveal.Content>
            <Reveal.Content hidden style={{width: '100%'}}>
                <Button 
                    basic
                    fluid 
                    color= {profiles.isFollowing ? 'red' : 'green'}
                    content= {profiles.isFollowing ? 'Unfollow' : 'Follow'}
                    loading={isFollowing}
                    onClick = {e => handleFollow(e, profiles.userName)}
                />
            </Reveal.Content>
        </Reveal>
    )
})