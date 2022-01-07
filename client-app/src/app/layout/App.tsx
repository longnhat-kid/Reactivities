import React, { useEffect } from 'react';
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
import LoginForm from '../../features/users/LoginForm';
import useStores from '../stores/stores';
import Loading from './Loading';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilesPage from '../../features/profiles/ProfilesPage';

export default observer(function App() {

  const location = useLocation();
  const {commonStore, userStore} = useStores();

  useEffect(() => {
    if(commonStore.token){
      userStore.getCurrentUser().finally(() => commonStore.setAppLoaded());
    }
    else{
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if(!commonStore.appLoaded) return <Loading content = 'Loading app...'/>

  return (
    <>
      <ToastContainer position="top-right"/>
      <ModalContainer/>
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
                <Route path='/profiles/:username' component={ProfilesPage}/>
                <Route path='/errors' component={TestErrors}/>
                <Route path='/server-error' component={ServerError}/>
                <Route path='/login' component={LoginForm}/>
                <Route component={NotFound}/>
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
})