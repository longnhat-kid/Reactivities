import { observer } from 'mobx-react-lite';
import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import useStores from '../../app/stores/stores';

export default observer(function ServerError(){
    const {commonStore} = useStores();
    return (
        <Container>
            <Header as='h1' content='Server Error' />
            <Header sub as='h5' color='red' content={commonStore.serverError?.message} />
            {commonStore.serverError?.details && (
                <Segment>
                    <Header as='h4' content='Stack Trace' color='teal'/>
                    <code style={{marginTop: '10px'}}>{commonStore.serverError?.details}</code>
                </Segment>
            )}
        </Container>
    )
})