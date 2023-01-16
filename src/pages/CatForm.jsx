/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable import/newline-after-import */
import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
// import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';

import dayjs from 'dayjs';

import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import base_url from '../apis';
export default function Form(props) {

    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState(dayjs(props.date ? new Date(props.date) : new Date()));
    const [sub_cat, setSubCat] = useState([]);

    useEffect( () => {
        getData()
      },[])

    const [img_obj, setObj] = useState({
        id: props.id ? props.id : "",
        image_url: props.avatarUrl ? props.avatarUrl : "",
        cat_name: props.cat_name ? props.cat_name : "",
        visibility: props.visibility ? props.visibility : "",
        cat_id: props.cat_id ? props.cat_id : "",
        date: props.date ? props.date : "",
        
    });
    
    const handleChange = (event) => {

       const {name, value} = event.target;

        setObj( (preValue) => {
            return {
                ...preValue,
                [name] : value,
            };
        })

    };

    const getData = async () => {
        let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
        const result = await axios.get(`${base_url}admin/cat`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + jwt_token,
          }
        });
        setSubCat(result.data.cat);

    }


    const updateData = async() => {
        let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
        const result = await axios.put(`${base_url}admin/react_editCat/${img_obj.id}`,img_obj, {
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

    const addData = async() => {
        let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
        const result = await axios.post(`${base_url}admin/react_addCat`,img_obj, {
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
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <div>
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.cat_name ? "" : "Category Name"}
                        value={img_obj.cat_name}
                        helperText="Enter Category Name"
                        name='cat_name'
                        onChange={handleChange}
                    />
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={img_obj.visibility}
                            onChange={handleChange}
                            name='visibility'
                        >
                            <MenuItem value={1}>True</MenuItem>
                            <MenuItem value={0}>False</MenuItem>
                        </Select>
                        <FormHelperText>Visibility</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.image_url ? "" : "Image Url"}
                        value={img_obj.image_url}
                        helperText="Enter Image Url"
                        name='image_url'
                        onChange={handleChange}
                    />
                </div>
                <div>
                <FormControl sx={{ m: 1, minWidth: 160 }}>
                        {/* <InputLabel id="demo-simple-select-label">Select Category</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={img_obj.cat_id}
                            name='cat_id'
                            onChange={handleChange}
                        >
                            {
                                sub_cat.map((doc) => {
                                    return (
                                        <MenuItem key={doc._id} value={doc._id}>{doc.cat_name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                        <FormHelperText>Select Sub Category</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DatePicker
                                // disableFuture
                                label="Date"
                                // openTo="year"
                               // views={['year', 'month', 'day']}
                                value={value}
                                name='date'
                                onChange={(newValue) => {
                                    setValue(newValue);
                                    img_obj.date = newValue;
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>
                </div>
                <div style={{textAlign:"center", margin:15}}>
                    <Button variant='contained' autoFocus onClick={props.id ? updateData : addData}>
                        {props.id ? 'Save Changes' : 'Add'}
                    </Button>
                </div>
            </FormControl>
            

        </Box>
    );
}
