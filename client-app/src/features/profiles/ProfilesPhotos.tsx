import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/photos/PhotoUploadWidget';
import { Photo, Profiles } from '../../app/models/profiles';
import useStores from '../../app/stores/stores';

interface Props {
    profiles: Profiles | null;
}

export default observer(function ProfilesPhotos({profiles}: Props){
    const {profilesStore: {isCurrentUser, uploadPhoto, isUpload, isSetMain, setMainPhoto, isDeleting, deletePhoto}} = useStores();
    const [isPhotoMode, setIsPhotoMode] = useState(false);
    const [targetMainPhoto, setTargetMainPhoto] = useState('');

    function handleUploadPhoto(file: Blob){
        uploadPhoto(file).then(() => setIsPhotoMode(false))
    }

    function handleSetMainPhoto(photo: Photo){
        setTargetMainPhoto(photo.id);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo){
        setTargetMainPhoto(photo.id);
        deletePhoto(photo.id);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos'/>
                    {isCurrentUser && (
                        <Button 
                            floated='right' 
                            basic 
                            content = {isPhotoMode ? "Cancel" : "Add Photo"}
                            onClick = {() => setIsPhotoMode(!isPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {isPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto = {handleUploadPhoto} loading = {isUpload}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profiles!.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url}/>
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic
                                                color={photo.isMain ? 'blue' : 'green'}
                                                icon={photo.isMain ? 'eye' : 'check'}
                                                disabled={photo.isMain}
                                                onClick = {() => handleSetMainPhoto(photo)}
                                                loading={isSetMain && photo.id === targetMainPhoto}
                                            />
                                            <Button 
                                                basic 
                                                color='red' 
                                                icon='trash'
                                                onClick={() => handleDeletePhoto(photo)}
                                                disabled={photo.isMain}
                                                loading={isDeleting && photo.id === targetMainPhoto}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})