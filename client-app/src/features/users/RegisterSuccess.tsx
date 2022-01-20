import React from 'react';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import useQuery from '../../app/common/utils/hook';

export default function RegisterSuccess(){
    const email = useQuery().get('email') as string;

    function handleResendEmail(){
        agent.users.resendConfirmEmail(email).then(() => {
            toast.success("Confirmation email resent - please check your email");
        })
    }
    
    return (
        <Segment placeholder textAlign='center'>
            <Header color='green'>
                <Icon name='check'/>
                Successfully registered !
            </Header>
            <p>Please check your email (including junk email) for the confirmation email.</p>
            {email && 
                <>
                    <p>Didn't receive the email? Click the below button to resend.</p>
                    <Button primary onClick={handleResendEmail} content='Resend email' size='huge'/>
                </>
            }
        </Segment>
    )
}