import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import useStores from '../../../app/stores/stores';

export default observer(function ActivityForm(){
    const {activityStore} = useStores();
    const initState = activityStore.selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initState);

    useEffect(() => setActivity(initState), [activityStore.selectedActivity]);


    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({
            ...activity,
            [name]: value
        })
    }

    return (
        <Segment clearing>
            <Form onSubmit={() => activityStore.submitActivity(activity)} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInputChange}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange}/>
                <Button loading={activityStore.submitting} floated='right' positive type='submit' content='Submit'/>
                <Button onClick={activityStore.closeForm} floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
})