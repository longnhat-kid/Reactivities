import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import useStores from '../../../app/stores/stores';

interface Props{
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default observer(function ActivityList({deleteActivity, submitting}: Props){
    const [target, setTarget] = useState('');

    const {activityStore} = useStores();

    function handleDeleteActivity(id: string){
        setTarget(id);
        deleteActivity(id);
    }

    return(
        <Segment>
            <Item.Group divided>
                {activityStore.activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as = 'a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => activityStore.selectActivity(activity.id)} floated = 'right' color = 'blue' content = 'View'/>
                                <Button 
                                    loading = {submitting && target === activity.id}
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