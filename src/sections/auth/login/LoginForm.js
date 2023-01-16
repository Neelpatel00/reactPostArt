/* eslint-disable camelcase */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
// import Alert from '@mui/material/Alert';
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

import base_url from '../../../apis';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  // const handleClick = (newState) => () => {
  //   setState({ open: true, ...newState });
  // };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // eslint-disable-next-line camelcase
  const [a_name, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");

  // eslint-disable-next-line camelcase
  const login_data = {
    a_name,
    password
  }

  const getLogin = async () => {
    const result = await axios.post(`${base_url}admin/react_login`, login_data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': 'Bearer ' + ecrs_token,
      }
    });
   
    setMsg(result.data.message);
    if(result.data.success === 200){
      localStorage.setItem('jwt_token',JSON.stringify(result.data.jwt_token));
      
      navigate('/dashboard', { replace: true });
    }
    else{
      setState({ ...state, open: true });
      // alert("please enter correct details");
      
    }
  }

  const getEmail = (event) =>{
    setEmail(event.target.value);
  }

  const getPassword = (event) =>{
    setPassword(event.target.value);
  }


  // const handleClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="a_name" label="Email address" onChange={getEmail} value={a_name} />

        <TextField
          value={password}
          onChange={getPassword}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={getLogin} >
        Login
      </LoadingButton>
      {/* <Button
        onClick={handleClick({
          vertical: 'top',
          horizontal: 'center',
        })}
      >
        Top-Center
      </Button> */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={msg}
        key={vertical + horizontal}
        ContentProps={{
          sx: {
            background: "red",
          }
        }}
      />
    </>
  );
}
