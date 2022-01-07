import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Profiles } from '../../app/models/profiles';
import ProfilesPhotos from './ProfilesPhotos';

interface Props {
    profiles: Profiles | null;
}

export default observer(function ProfilesContent({profiles}: Props){
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About</Tab.Pane>},
        {menuItem: 'Photos', render: () => <ProfilesPhotos profiles={profiles}/>},
        {menuItem: 'Events', render: () => <Tab.Pane>Events</Tab.Pane>},
        {menuItem: 'Followers', render: () => <Tab.Pane>Followers</Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane>Following</Tab.Pane>}
    ]
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition = 'right'
            panes={panes}
        />
    )
})