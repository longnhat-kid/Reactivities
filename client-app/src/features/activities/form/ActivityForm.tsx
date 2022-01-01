import { Formik, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import useStores from '../../../app/stores/stores';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDatePicker from '../../../app/common/form/MyDatePicker';
import { Activity } from '../../../app/models/activity';
import { history } from '../../..';

export default observer(function ActivityForm(){
    const {activityStore} = useStores();
    const {id} = useParams<{id: string}>();
    const initialState = {
        id: '',
        title: '',
        date: null,
        description: '',
        category: '',
        city: '',
        venue: ''
    };
    const [activity, setActivity] = useState<Activity>(initialState);

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required !'),
        description: Yup.string().required('The activity description is required !'),
        category: Yup.string().required(),
        city: Yup.string().required('The city is required !'),
        venue: Yup.string().required('The venue is required !'),
        date: Yup.date().nullable().required('The activity date is required !')
    })

    function handleFormSubmit(activity: Activity) {
        activityStore.submitActivity(activity).then(() => {
            history.push(`/details/${activityStore.selectedActivity!.id}`)
        });
    }


    useEffect(() => {
        if(id){
            activityStore.loadActivityDetail(id).then((activity) => {
                setActivity(activity)
            })
        }
    }, [activityStore, id])

    if(!activityStore.selectedActivity && id) return <Loading content = 'Loading select activity...'/>

    return (
        <Segment clearing>
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isSubmitting, isValid, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Header content='Activity Details' sub color='teal'/>
                        <MyTextInput name='title' placeholder='Title'/>
                        <MyTextArea rows={4} placeholder='Description' name='description'/>
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category'/>
                        <MyDatePicker 
                            placeholderText='Date' 
                            name='date' 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='dd MMM yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <MyTextInput placeholder='City' name='city'/>
                        <MyTextInput placeholder='Venue' name='venue'/>
                        <Button
                            disabled = {isSubmitting || !dirty || !isValid} 
                            loading={isSubmitting} 
                            floated='right' 
                            positive 
                            type='submit' 
                            content='Submit'
                        />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})