import { observer } from 'mobx-react-lite'
import React from 'react'
import { Menu } from 'semantic-ui-react'
import useStores from '../../app/stores/stores';

export default observer(function ProfilesEventsMenu()  {
    const {profilesStore} = useStores();
    const {activeEventMenu, setActiveEventMenu, loadingUserActivities} = profilesStore;

    function handleItemClick(activeMenu: string){
        setActiveEventMenu(activeMenu);
    }

    return (
        <Menu pointing secondary>
            <Menu.Item
                name='Future Events'
                active={activeEventMenu === 'future'}
                disabled = {activeEventMenu !== 'future' && loadingUserActivities}
                onClick={() => handleItemClick('future')}
            />
            <Menu.Item
                name='Past Events'
                active={activeEventMenu === 'past'}
                disabled = {activeEventMenu !== 'past' && loadingUserActivities}
                onClick={() => handleItemClick('past')}
            />
            <Menu.Item
                name='Hosting'
                active={activeEventMenu === 'hosting'}
                disabled = {activeEventMenu !== 'hosting' && loadingUserActivities}
                onClick={() => handleItemClick('hosting')}
            />
        </Menu>
    )
})