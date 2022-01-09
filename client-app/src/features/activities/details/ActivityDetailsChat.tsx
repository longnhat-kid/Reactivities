import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import {Segment, Header, Comment, Loader, Button} from 'semantic-ui-react'
import useStores from '../../../app/stores/stores';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

export default observer(function ActivityDetailsChat() {
    const {id} = useParams<{id: string}>();

    const {commentStore, userStore} = useStores();

    useEffect(() => {
        if(id){
            commentStore.createHubConnection(id);
        }
        return () => commentStore.clearComments();
    }, [commentStore, id])

    const validationSchema = Yup.object({
        body: Yup.string().required('Comment body cannot be empty!')
    })

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.photo || '/assets/user.png'}/>
                            <Comment.Content>
                                {comment.userName === userStore.user?.userName && (
                                    <Button 
                                        basic 
                                        color='red' 
                                        icon='trash'
                                        floated='right'
                                        size='mini'
                                    />
                                )}
                                
                                <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>
                                    <strong>{comment.displayName}</strong>
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createAt) + ' ago'}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>
                                    {comment.body}
                                </Comment.Text>
                                
                            </Comment.Content>
                        </Comment>
                    ))}

                    <Formik
                        onSubmit={(values, {resetForm}) => 
                            commentStore.sendComment(values).then(() => resetForm())}
                        initialValues={{body: ''}}
                        validationSchema={validationSchema}
                    >
                        {({isSubmitting, isValid, handleSubmit}) => (
                            <Form className='ui form' style={{marginTop: 20}}>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{position: 'relative'}}>
                                            <Loader active={isSubmitting}/>
                                            <textarea
                                                placeholder='Add comment (Enter to submit, SHIFT + Enter for new line)'
                                                rows={4}
                                                {...props.field}
                                                onKeyPress={e => {
                                                    if(e.key === 'Enter' && e.shiftKey){
                                                        return;
                                                    }
                                                    if(e.key === 'Enter' && !e.shiftKey){
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                </Comment.Group>
            </Segment>
        </>
    )
})