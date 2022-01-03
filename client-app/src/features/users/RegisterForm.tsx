import { Formik, Form, ErrorMessage } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import useStores from '../../app/stores/stores';
import * as Yup from 'yup';
import ValidationError from '../errors/ValidationError';

export default observer(function RegisterForm(){
    const {userStore} = useStores();

    const validationSchema = Yup.object({
        displayName: Yup.string().required('The display name is required !'),
        userName: Yup.string().required('The username is required !'),
        email: Yup.string().required('The username is required !').email('Email must be a valid email !'),
        password: Yup.string().required('The password is required !').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}$/, 'Password must contain 6-10 characters, consist of number, lowercase, uppercase.')
    })

    return (
        <Formik
            initialValues={{displayName: '' , userName: '' ,email: '', password: '', error: null}}
            onSubmit = {(values, {setErrors}) => 
                userStore.register(values).catch(error => setErrors({error}))}
            
            validationSchema = {validationSchema}
        >
            {({handleSubmit, isSubmitting, dirty, isValid, errors}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content = 'Register to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name='displayName' placeholder='Display Name'/>
                    <MyTextInput name='email' placeholder='Email'/>
                    <MyTextInput name='userName' placeholder='Username'/>
                    <MyTextInput name='password' placeholder='Password' type='password'/>
                    <ErrorMessage 
                        name='error' render={() => <ValidationError errors={errors.error}/>}
                    />
                    <Button
                        disabled = {isSubmitting || !dirty || !isValid} 
                        loading={isSubmitting} 
                        positive 
                        type='submit' 
                        content='Register'
                        fluid
                    />
                </Form>
            )}
        </Formik>
    )
})