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

  useEffect( () => {
    userData()
  },[])

  // eslint-disable-next-line camelcase
  let today_date = new Date().toDateString()
  let time = new Date().toLocaleTimeString();

  let handleChange = (event) => {
      setFile(event.target.files[0]);
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
                  {home_data.last_user ? new Date(home_data.last_user.updatedAt).toDateString() : ""}
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
          
        </Grid>
      </Container>
    </>
  );
}
