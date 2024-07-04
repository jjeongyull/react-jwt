import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Box, TextField, Button, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import postApi from '../utils/api';
import Alert from '../components/Alert';
import { setUserInfo } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
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

  const register = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    const user_id = formData.get('user_id');
    const user_pw = formData.get('user_pw');
    const user_name = formData.get('user_name');
  
    // 각 필드에 대한 유효성 검사
    if (!user_id) {
      setError('아이디를 입력하세요');
      setAlertMessage('아이디를 입력하세요');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
  
    if (!user_pw) {
      setError('비밀번호를 입력하세요');
      setAlertMessage('비밀번호를 입력하세요');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
  
    if (!user_name) {
      setError('이름을 입력하세요');
      setAlertMessage('이름을 입력하세요');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
  
    const data = {
      cmd: 'register',
      user_id,
      user_pw,
      user_name,
    };
  
    try {
      const result = await postApi(data);
      if (result.success) {
        dispatch(setUserInfo(result.user));
        setAlertMessage('Registration successful');
        setAlertSeverity('success');
        setAlertOpen(true);
        navigate('/');
      } else {
        setError(result.error || 'Registration failed');
        setAlertMessage(result.error || 'Registration failed');
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
          회원가입
        </Typography>
        <Box component="form" onSubmit={register} noValidate sx={{ mt: 1 }}>
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
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="user_name"
            label="Full Name"
            name="user_name"
            autoComplete="name"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            회원가입
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

export default RegisterPage;
