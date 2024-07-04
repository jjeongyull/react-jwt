import React, {useState} from 'react';
import { Container, Button, Typography, Avatar, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, selectUserInfo } from '../features/user/userSlice';
import cookiesFunction from '../utils/cookie';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const [confirmState, setConfirmState] = useState(false);

  const confirmOpen = () => {
    setConfirmState(true);
  };

  const confirmClose = () => {
    setConfirmState(false);
  };

  const LogOut = () => {
    cookiesFunction.deleteCookie('jwt');
    dispatch(clearUserInfo());
    navigate('/');
  }

  return (
    <Container>
      <div className='main'>
        <Typography variant="h5" gutterBottom>
          로그인 완료
        </Typography>
        {userInfo && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="body1" gutterBottom>
              User ID: {userInfo.user_id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              User Name: {userInfo.user_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              User Level: {userInfo.user_level}
            </Typography>
          </Box>
        )}
        <Button onClick={confirmOpen} variant="contained" sx={{ mt: 3 }}>
          Log Out
        </Button>
      </div>
      <ConfirmationDialog
        open={confirmState}
        onClose={confirmClose}
        onConfirm={LogOut}
        message="로그아웃 하시겠습니까?"
      />
    </Container>
  )
}

export default MainPage;
