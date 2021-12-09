import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import useStores from '../../../app/stores/stores';

export default observer(function ActivityList(){
    const [target, setTarget] = useState('');

    const {activityStore} = useStores();

    function handleDeleteActivity(id: string){
        setTarget(id);
        activityStore.deleteActivity(id);
    }

    return(
        <Segment>
            <Item.Group divided>
                {activityStore.getActivitiesByDateTime().map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as = 'a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={Link} to={`/details/${activity.id}`} floated = 'right' color = 'blue' content = 'View'/>
                                <Button 
                                    loading = {activityStore.submitting && target === activity.id}
                                    onClick={() => handleDeleteActivity(activity.id)} 
                                    floated = 'right' 
                                    color = 'red' 
                                    content = 'Delete'
                                />
                                <Label basic content = {activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})