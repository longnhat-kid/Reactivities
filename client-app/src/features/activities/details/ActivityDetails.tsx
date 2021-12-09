import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import useStores from '../../../app/stores/stores';


export default observer(function ActivityDetails(){
    const {activityStore} = useStores();
    const {selectedActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    useEffect(()=> {activityStore.loadActivityDetail(id)},[activityStore, id]);

    if(!activityStore.selectedActivity) return <Loading content = 'Loading select activity...'/>

    return(
        <Card fluid>
            <Image src={`/assets/categoryImages/${selectedActivity?.category}.jpg`} />
            <Card.Content>
                <Card.Header>{selectedActivity?.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity?.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity?.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button as={Link} to={`/updating/${selectedActivity?.id}`} basic color='blue' content = 'Edit' />
                    <Button as={Link} to='/activities' basic color='grey' content = 'Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})