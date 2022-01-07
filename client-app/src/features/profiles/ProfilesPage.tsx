import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loading from '../../app/layout/Loading';
import useStores from '../../app/stores/stores';
import ProfilesContent from './ProfilesContent';
import ProfilesHeader from './ProfilesHeader';

export default observer(function ProfilesPage(){
    const {username} = useParams<{username: string}>();

    const {profilesStore} = useStores();
    const {isLoading, getProfiles, profiles} = profilesStore;

    useEffect(() => {
        profilesStore.getProfiles(username);
    }, [profilesStore, getProfiles, username])

    if(isLoading) return <Loading content = 'Loading profiles...'/>

    return (
        <Grid>
            <Grid.Column width="16">
                <ProfilesHeader profiles={profiles}/>
                <ProfilesContent profiles={profiles}/>
            </Grid.Column>
        </Grid>
    )
})