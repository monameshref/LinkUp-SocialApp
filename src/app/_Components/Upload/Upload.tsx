"use client"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ImageIcon from '@mui/icons-material/Image';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Upload({imageInputRef}: {imageInputRef? : React.Ref<HTMLInputElement> | null}) {
    return (
        <Button
            component="label"
            variant="contained"
            sx={{
                minWidth: "40px",
                height: "40px",
                padding: "8px",
            }} >

                <ImageIcon />Photo
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
                ref={imageInputRef}
                />
        </Button>
    );
}