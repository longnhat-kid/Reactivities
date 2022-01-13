import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Profiles } from '../../app/models/profiles';
import useStores from '../../app/stores/stores';
import ProfilesEvents from './ProfilesEvents';
import ProfilesFollows from './ProfilesFollows';
import ProfilesPhotos from './ProfilesPhotos';

interface Props {
    profiles: Profiles | null;
}

export default observer(function ProfilesContent({profiles}: Props){
    const {profilesStore} = useStores();
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About</Tab.Pane>},
        {menuItem: 'Photos', render: () => <ProfilesPhotos profiles={profiles}/>},
        {menuItem: 'Events', render: () => <ProfilesEvents />},
        {menuItem: 'Followers', render: () => <ProfilesFollows/>},
        {menuItem: 'Following', render: () => <ProfilesFollows/>}
    ]
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition = 'right'
            panes={panes}
            onTabChange={(e, data) => profilesStore.setActiveTab(data.activeIndex)}
        />
    )
})