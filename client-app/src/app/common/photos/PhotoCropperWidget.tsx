import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css'

interface Props {
    photoPreview: string;
    setCropper: (cropper: Cropper) => void
}

export default function PhotoCropperWidget({photoPreview, setCropper}: Props){
    return (
        <Cropper
            src={photoPreview}
            style={{height: 200, width: '100%'}}
            initialAspectRatio={1}
            aspectRatio={1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    )
}