import React, {useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import Loading from './Loading';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() =>{
    agent.requests.activityList().then(data => {
      setActivities(data);
      setLoading(false);
    })
  }, [])

  function handleSelectActivity (id: string){
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleSubmitActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id){
      agent.requests.updateActivity(activity).then(() => {
        setActivities([...activities.filter( x => x.id !== activity.id), activity]);
        setSubmitting(false);
        setEditMode(false); 
        setSelectedActivity(activity);
      })
    }
    else{
      activity.id = uuid();
      agent.requests.createActivity(activity).then(() => {
        setActivities([...activities, {...activity}]);
        setSubmitting(false);
        setEditMode(false); 
        setSelectedActivity(activity);
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

  if(loading) return <Loading/>

  return (

    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity} 
          selectActivity={handleSelectActivity} 
          cancelSelectActivity={handleCancelSelectActivity} 
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          submitActivity={handleSubmitActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
