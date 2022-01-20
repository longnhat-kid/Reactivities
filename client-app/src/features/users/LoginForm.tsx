import { Formik, Form, ErrorMessage } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import useStores from '../../app/stores/stores';

export default observer(function LoginForm(){
    const {userStore} = useStores();
    return (
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit = {(values, {setErrors})=> userStore.login(values).catch(error => setErrors({error: error.response.data}))}
        >
            {({handleSubmit, isSubmitting, dirty, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content = 'Login to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name='email' placeholder='Email'/>
                    <MyTextInput name='password' placeholder='Password' type='password'/>
                    <ErrorMessage 
                        name='error' render={() => <Label style={{marginBottom: 10}} basic color='red' content={errors.error}/>}
                    />
                    <Button
                        disabled = {isSubmitting || !dirty} 
                        loading={isSubmitting} 
                        positive 
                        type='submit' 
                        content='Submit'
                        fluid
                    />
                </Form>
            )}
        </Formik>
    )
})