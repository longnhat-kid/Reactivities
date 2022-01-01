import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/activities/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';

export default observer(function App() {

  const location = useLocation();

  return (
    <>
      <ToastContainer position="top-right"/>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path='/(.+)' 
        render = {() => (
          <>
            <NavBar/>
            <Container style={{marginTop: '7em'}}>
              <Switch>
                <Route path='/activities' component={ActivityDashboard}/>
                <Route key={location.key} path={['/creating', '/updating/:id']} component={ActivityForm}/>
                <Route path='/details/:id' component={ActivityDetails}/>
                <Route path='/errors' component={TestErrors}/>
                <Route path='/server-error' component={ServerError}/>
                <Route component={NotFound}/>
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
})