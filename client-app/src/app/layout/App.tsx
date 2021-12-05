import React, {useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import Loading from './Loading';
import useStores from '../stores/stores';
import { observer } from 'mobx-react-lite';

export default observer(function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {activityStore} = useStores();

  useEffect(() =>{
    activityStore.loadActivities();
  }, [activityStore])

  function handleSubmitActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id){
      agent.requests.updateActivity(activity).then(() => {
        setActivities([...activities.filter( x => x.id !== activity.id), activity]);
        setSubmitting(false);
        //setEditMode(false); 
        //setSelectedActivity(activity);
      })
    }
    else{
      activity.id = uuid();
      agent.requests.createActivity(activity).then(() => {
        setActivities([...activities, {...activity}]);
        setSubmitting(false);
        //setEditMode(false); 
        //setSelectedActivity(activity);
      })
    }
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.requests.deleteActivity(id).then(() => {
      setActivities([...activities.filter( x => x.id !== id)])
      setSubmitting(false);
    })
  }

  if(activityStore.loadingInit) return <Loading/>

  return (

    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          submitActivity={handleSubmitActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
})