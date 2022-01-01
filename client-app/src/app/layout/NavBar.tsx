import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import useStores from '../stores/stores';

export default function NavBar(){
    const {activityStore} = useStores();
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
                <Menu.Item as={NavLink} to='/errors' name = "Errors"/>
            </Container>
        </Menu>
    )
}