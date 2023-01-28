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
    const [value, setValue] = useState(dayjs(props.image_date ? new Date(props.image_date) : new Date()));

    const [cat, setCat] = useState([]);
    const [sub_cat, setSubCat] = useState([]);

    useEffect( () => {
        getData()
      },[])

    const [img_obj, setObj] = useState({
        id: props.id ? props.id : "",
        image_url: props.avatarUrl ? props.avatarUrl.replace("https://gitlab.com/ayurvedchikitsamd/post_art_one/-/raw/main/","") : "",
        fst_name: props.name ? props.name : "",
        image_visibility: props.image_visibility ? props.image_visibility : "0",
        year: props.year ? props.year : "",
        amount: props.amount ? props.amount : "",
        text_color: props.text_color ? props.text_color : "",
        reso: props.resolution ? props.resolution : "",
        frames: props.default_frames ? props.default_frames : "",
        isBackground: props.isBackground ? props.isBackground : "0",
        cat_id: props.cat_id ? props.cat_id : "",
        subcat_id: props.subcat_id ? props.subcat_id : "",
        image_date: props.image_date ? props.image_date : "",
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
        setCat(result.data.cat);
        setSubCat(result.data.sub_cat);

    }


    const updateData = async() => {
        let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
        const result = await axios.put(`${base_url}admin/react_editImage/${img_obj.id}`,img_obj, {
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
        const result = await axios.post(`${base_url}admin/react_addImage`,img_obj, {
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
                        label={img_obj.fst_name ? "" : "Festival Name"}
                        value={img_obj.fst_name}
                        helperText="Enter Festival Name"
                        name='fst_name'
                        onChange={handleChange}
                    />
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.text_color ? "" : "Text Color"}
                        value={img_obj.text_color}
                        helperText="Choose Color"
                        name='text_color'
                        onChange={handleChange}
                    />
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
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.reso ? "" : "Resolution"}
                        value={img_obj.reso}
                        helperText="Add Resolution"
                        name='reso'
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
                                cat.map((doc) => {
                                    return (
                                        <MenuItem key={doc._id} value={doc._id}>{doc.cat_name}</MenuItem>
                                    );
                                })
                            }

                            {/* <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                        <FormHelperText>Select Category</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        {/* <InputLabel id="demo-simple-select-label">Select Sub Category</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={img_obj.subcat_id}
                            name='subcat_id'
                            onChange={handleChange}
                        >
                        {
                                sub_cat.map((doc) => {
                                    return (
                                        <MenuItem key={doc._id} value={doc._id}>{doc.cat_name}</MenuItem>
                                    );
                                })
                            }
                            {/* <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                        <FormHelperText>Select Sub Category</FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.amount ? "" : "Amount"}
                        value={img_obj.amount}
                        name='amount'
                        helperText="Enter Amount"
                        onChange={handleChange}
                    />
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.frames ? "" : "Default Frames"}
                        value={img_obj.frames}
                        helperText="Enter Default Frames"
                        name='frames'
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <TextField
                        id="outlined-basic-helper-text"
                        label={img_obj.year ? "" : "Year"}
                        value={img_obj.year}
                        helperText="Enter Year"
                        name='year'
                        onChange={handleChange}
                    />
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={img_obj.isBackground}
                            onChange={handleChange}
                            name='isBackground'
                        >
                            <MenuItem value={1}>True</MenuItem>
                            <MenuItem value={0}>False</MenuItem>
                        </Select>
                        <FormHelperText>Background</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={img_obj.image_visibility}
                            onChange={handleChange}
                            name='image_visibility'
                        >
                            <MenuItem value={1}>True</MenuItem>
                            <MenuItem value={0}>False</MenuItem>
                        </Select>
                        <FormHelperText>Image Visibility</FormHelperText>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DatePicker
                                // disableFuture
                                label="Date"
                                // openTo="year"
                               // views={['year', 'month', 'day']}
                                value={value}
                                name='image_date'
                                onChange={(newValue) => {
                                    setValue(newValue);
                                    img_obj.image_date = newValue;
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
