import React, { useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoCropperWidget from './PhotoCropperWidget';
import PhotoDropzoneWidget from './PhotoDropzoneWidget';

interface Props {
    uploadPhoto: (file: Blob) => void;
    loading: boolean;
}


export default function PhotoUploadWidget({uploadPhoto, loading}: Props){
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop(){
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4} textAlign='center'>
                <Header sub color='teal' content='Step 1 - Add Photo'/>
                <PhotoDropzoneWidget setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={5} textAlign='center'>
                <Header sub color='teal' content='Step 2 - Resize Photo'/>
                {files && files.length > 0 && (
                    <PhotoCropperWidget setCropper={setCropper} photoPreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={5} textAlign='center'>
                <Header sub color='teal' content='Step 3 - Preview & Upload'/>
                {files && files.length > 0 && (
                    <>
                        <div className='img-preview' style={{minHeight: 200, overflow: 'hidden'}}/>
                    </>
                )}
            </Grid.Column>
            <Grid.Column width={4}/>
            <Grid.Column width={8}>
                {files && files.length > 0 && (
                    <Button.Group widths={2}>
                        <Button loading={loading} onClick={onCrop} positive icon='check' />
                        <Button onClick={() => setFiles([])} icon='close' />
                    </Button.Group>
                )}
            </Grid.Column>
            <Grid.Column width={4}/>
        </Grid>
    )
}