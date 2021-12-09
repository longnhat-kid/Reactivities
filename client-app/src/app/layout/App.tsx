import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/activities/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

export default observer(function App() {

  const location = useLocation();

  return (
    <>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path='/(.+)' 
        render = {() => (
          <>
            <NavBar/>
            <Container style={{marginTop: '7em'}}>
              <Route path='/activities' component={ActivityDashboard}/>
              <Route key={location.key} path={['/creating', '/updating/:id']} component={ActivityForm}/>
              <Route path='/details/:id' component={ActivityDetails}/>
            </Container>
          </>
        )}
      />
    </>
  );
})