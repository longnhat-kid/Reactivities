import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import useStores from '../stores/stores';

export default observer(function NavBar(){
    const {activityStore, userStore:{user, logout}} = useStores();
    return (
        <Menu inverted fixed = "top">
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src="/assets/logo.png" alt="logo" style = {{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name = "Activities"/>
                <Menu.Item >
                    <Button onClick={() => activityStore.cancelSelectActivity()} as={NavLink} to='/creating' positive content = "Create Activity"/>
                </Menu.Item>
                <Menu.Item position='right'>
                    <Image src={user?.mainPhoto || '/assets/user.png'} avatar spaced='right'/>
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text='My Profile' icon='user'/>
                            <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})