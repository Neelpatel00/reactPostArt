/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';
// import DialogContentText from '@mui/material/DialogContentText';
import axios from 'axios';
import base_url from '../apis';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};


// eslint-disable-next-line react/prop-types
export default function CustomizedDialogs2({ children, type }) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    let api_url = "";
    if(type == "Image"){
        api_url = `${base_url}admin/deleteImage/${children}`;
    }
    else{
        api_url = `${base_url}admin/react_deleteCat/${children}`;
    }

    const deleteImage = async() => {
        let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
        const result = await axios.delete(api_url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + jwt_token,
          }
        });
        sessionStorage.setItem('msg',result.data.message);
        sessionStorage.setItem('success',result.data.success);
        sessionStorage.setItem('show_msg',true);
        window.location.reload(false);
    }

    return (
        <div>
            <Button variant="text" onClick={handleClickOpen}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to Delete ?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={deleteImage}>Yes</Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
