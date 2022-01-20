import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import useQuery from '../../app/common/utils/hook';
import useStores from '../../app/stores/stores';
import LoginForm from './LoginForm';

export default function ConfirmEmail(){
    const {modalStore} = useStores();
    const email = useQuery().get('email') as string;
    const token = useQuery().get('token') as string;

    function handleResendEmail(){
        agent.users.resendConfirmEmail(email).then(() => {
            toast.success("Confirmation email resent - please check your email");
        })
    }

    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success'
    }
    const [status, setStatus] = useState(Status.Verifying);

    useEffect(() => {
        agent.users.confirmEmail(token, email).then(() => {
            setStatus(Status.Success)
        }).catch(() => {
            setStatus(Status.Failed)
        })
    }, [Status.Failed, Status.Success, token, email])

    function getBody() {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return (
                    <div>
                        <p>Verification failed.  You can try resending the verify link to your email</p>
                        <Button primary onClick={handleResendEmail} size='huge' content='Resend email' />
                    </div>
                );
            case Status.Success:
                return (
                    <div>
                        <p>Email has been verified - you can now login</p>
                        <Button primary onClick={() => modalStore.openModal(<LoginForm />)} size='medium' >
                            Login to Reactivities
                        </Button>
                    </div>
                );
        }
    }

    return (
        <Segment placeholder textAlign='center'>
            <Header icon color='olive'>
                <Icon name='envelope' />
                Email verification
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    )
}