import React, {useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import useStores from '../stores/stores';
import { observer } from 'mobx-react-lite';

export default observer(function App() {

  const {activityStore} = useStores();

  useEffect(() =>{
    activityStore.loadActivities();
  }, [activityStore])

  if(activityStore.loadingInit) return <Loading/>

  return (
    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
})