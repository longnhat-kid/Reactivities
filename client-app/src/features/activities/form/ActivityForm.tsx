import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props{
    activity: Activity | undefined;
    closeForm: () => void;
    submitActivity: (activity: Activity) => void;
    submitting: boolean;
}

export default function ActivityForm({activity: selectedActivity, closeForm, submitActivity, submitting} : Props){
    const initState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initState);

    useEffect(() => setActivity(initState), [selectedActivity]);

    function handleSubmit(){
        submitActivity(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({
            ...activity,
            [name]: value
        })
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInputChange}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange}/>
                <Button loading={submitting} floated='right' positive type='submit' content='Submit'/>
                <Button onClick={closeForm} floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
}