import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, selectUserInfo } from '../features/user/userSlice';
import { useNavigate, Outlet } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Avatar, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ConfirmationDialog from '../components/ConfirmationDialog';
import cookiesFunction from '../utils/cookie';

const Sidebar = () => {
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
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', mt: 2 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          {userInfo && (
            <Typography variant="body1" gutterBottom>
              {userInfo.user_name}
            </Typography>
          )}
        </Box>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button onClick={confirmOpen} variant="contained" fullWidth>
            Log Out
          </Button>
        </Box>
        <ConfirmationDialog
          open={confirmState}
          onClose={confirmClose}
          onConfirm={LogOut}
          message="로그아웃 하시겠습니까?"
        />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
