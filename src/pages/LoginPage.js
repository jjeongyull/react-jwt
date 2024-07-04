import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Box, TextField, Button, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import postApi from '../utils/api';
import cookiesFunction from '../utils/cookie';
import Alert from '../components/Alert';
import { setUserInfo } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const login = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = {
      cmd: 'login',
      user_id: formData.get('user_id'),
      user_pw: formData.get('user_pw'),
    };

    try {
      const result = await postApi(data);
      if (result.success) {
        cookiesFunction.setCookie('jwt', result.jwt, 1);
        dispatch(setUserInfo(result.user));
        navigate('/main');
      } else {
        setError(result.error || 'Login failed');
        setAlertMessage(result.error || 'Login failed');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('There was an error!', error);
      setError('Error communicating with server');
      setAlertMessage('Error communicating with server');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="user_id"
            label="User ID"
            name="user_id"
            autoComplete="user_id"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="user_pw"
            label="Password"
            type="password"
            id="user_pw"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => navigate('/register')}
          >
            회원가입 하기
          </Button>
        </Box>

        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      <Alert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={handleAlertClose}
      />
    </Container>
  );
};

export default LoginPage;
