/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
// import { faker } from '@faker-js/faker';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
// components
// import Iconify from '../components/iconify';
// sections
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

import base_url from '../apis';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  // const theme = useTheme();
  const [ctime, setTime] = useState();

  const [file, setFile] = useState();

  const [home_data, setHomeData] = useState({});

  const [payload, setPayload] = useState({});

  const [show1, setShow] = useState("hidden");

  const [show2, setShow2] = useState("hidden");

  const [sub_cat, setSubCat] = useState([]);

  const [v1, setV1] = useState("2");

  const [v2, setV2] = useState("2");

  const [v3, setV3] = useState("2");

  useEffect( () => {
    userData()
  },[])

  // eslint-disable-next-line camelcase
  let today_date = new Date().toDateString()
  let time = new Date().toLocaleTimeString();
  const options = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: '2-digit', minute:'2-digit'};

  let handleChange = (event) => {
      setFile(event.target.files[0]);
  }

  let showHide = async (event) => {
    changeMsg(event);
    let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
    setV2(event.target.value)
    if (event.target.value === 1) {
      setV1(event.target.value)
      setShow("visible");
      setShow2("hidden");
      const result = await axios.get(`${base_url}admin/react_subcat/`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + jwt_token,
        }
      });
  
      setSubCat(result.data.cat);
    }
    if (event.target.value === 3) {
      setV3(event.target.value)
      setShow2("visible")
      setShow("hidden");

    }

    if(event.target.value === 2 || event.target.value === 4){
      setShow2("hidden")
      setShow("hidden");
    }

    
  }

  let onsubmit = async() => {
    let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
    let formData = new FormData();
    formData.append("csv_data", file);
    let result  = await axios.post(`${base_url}admin/reactimportcsv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + jwt_token,
      }
    });
    
    window.location.reload(false);

  }

  const userData = async() => {
    let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
    let result  = await axios.get(`${base_url}admin/react_home`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + jwt_token,
      }
    });
    setHomeData({total_users : result.data.users, total_images : result.data.images, last_user : result.data.last_user})
  };
  let updateTime = () =>{
    time = new Date().toLocaleTimeString();
    setTime(time);
  }

  let changeMsg = (event) => {
    const {name, value} = event.target;

        setPayload( (preValue) => {
            return {
                ...preValue,
                [name] : value,
            };
        })
}

let onSend = async() => {
  let jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
  
  let result  = await axios.post(`${base_url}admin/sendnotification`, payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + jwt_token,
    }
  });
  
  window.location.reload(false);

}

  setInterval(updateTime, 1000);

  return (
    <>
      <Helmet>
        <title> Dashboard | Post-Art </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Users" total={home_data.total_users} icon={'mdi:account-group'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Images" total={home_data.total_images} color="info" icon={'bi:images'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title={today_date} total={ctime} color="warning" icon={'uis:calender'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Be Happy..." total="Smile" color="error" icon={'bxs:wink-smile'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="280"
                  image="/assets/images/avatars/image_avtar_1.jpeg"
                  alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Last Active User
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                  {home_data.last_user ? home_data.last_user.full_name : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {home_data.last_user ? new Date(home_data.last_user.updatedAt).toLocaleDateString("en-US", options) : ""}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <div>
                  <form>
                    <Typography variant="h4" sx={{ mb: 5 }}>
                      Upload File Here
                    </Typography>
                    <input type="file" onChange={handleChange} />
                  </form>
                </div>
              </CardContent>
              <CardActions>
                <Button sx={{ m: 2 }} size="medium" variant="contained" onClick={onsubmit}>Upload</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <div>
                  <form>
                    <Typography variant="h4" sx={{ mb: 5 }}>
                      Send Notification
                    </Typography>
                    <TextField
                        id="outlined-basic-helper-text"
                        label="Title"
                        value={payload.title}
                        helperText="Enter Title"
                        name='title'
                        onChange={changeMsg}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <TextField
                        id="outlined-basic-helper-text"
                        label="Message"
                        value={payload.msg}
                        helperText="Enter Message"
                        name='msg'
                        onChange={changeMsg}
                    />
                    <br />
                    <br />
                    <TextField
                        fullWidth 
                        id="fullWidth"
                        label="Image"
                        value={payload.img_url}
                        helperText="Enter Image Url"
                        name='img_url'
                        onChange={changeMsg}
                    />
                    <br />
                    <br />
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={v2}
                            onChange={showHide}
                            name='type'
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                        </Select>
                        <FormHelperText>Type</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 160, visibility:show1 }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={payload.subcat_id}
                            onChange={showHide}
                            name='subcat_id'
                        >
                            {
                                sub_cat.map((doc) => {
                                    return (
                                        <MenuItem key={doc._id} value={doc._id}>{doc.cat_name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                        <FormHelperText>Sub Category</FormHelperText>
                    </FormControl>
                    <br />
                    <br />
                    <TextField
                        fullWidth 
                        id="fullWidth"
                        label="Fcm Token"
                        value={payload.fcm_token}
                        helperText="Enter Fcm Token"
                        name='fcm_token'
                        onChange={changeMsg}
                    />
                    <br />
                    <br />
                    <TextField sx={{ m: 1, minWidth: 160, visibility:show2 }}
                        fullWidth 
                        id="fullWidth"
                        label="Category"
                        value={payload.cat_id}
                        helperText="Enter Category"
                        name='cat_id'
                        onChange={changeMsg}
                    />
                  </form>
                </div>
              </CardContent>
              <CardActions>
                <Button sx={{ m: 2 }} size="medium" variant="contained" onClick={onSend}>Send</Button>
              </CardActions>
            </Card>
          </Grid>
          
        </Grid>
      </Container>
    </>
  );
}
