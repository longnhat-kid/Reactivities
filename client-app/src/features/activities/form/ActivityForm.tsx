import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { Activity } from '../../../app/models/activity';
import useStores from '../../../app/stores/stores';

export default observer(function ActivityForm(){
    const {activityStore} = useStores();
    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const initialState = {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    };
    const [activity, setActivity] = useState(initialState);

    useEffect(() => {
        if(id){
            activityStore.loadActivityDetail(id).then((activity) => {
                setActivity(activity)
            })
        }
    }, [activityStore, id])

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({
            ...activity, 
            [name]: value
        })
    }

    function handleSubmit(activity: Activity) {
        activityStore.submitActivity(activity).then(() => {
            history.push(`/details/${activityStore.selectedActivity!.id}`)
        });
    }

    if(!activityStore.selectedActivity && id) return <Loading content = 'Loading select activity...'/>

    return (
        <Segment clearing>
            <Form onSubmit={() => handleSubmit(activity)} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInputChange}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange}/>
                <Button loading={activityStore.submitting} floated='right' positive type='submit' content='Submit'/>
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
})