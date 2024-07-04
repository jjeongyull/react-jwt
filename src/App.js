import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { setUserInfo, clearUserInfo } from './features/user/userSlice';

// api
import postApi from './utils/api';
import cookiesFunction from './utils/cookie';
// page
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// css
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkToken = async () => {
    try {
      const cookie = cookiesFunction.getCookie('jwt');
      const response = await postApi({ cmd: 'loginChk', jwt: cookie });
      if (response.success) {
        dispatch(setUserInfo(response.user));
        navigate('/main');
      } else {
        dispatch(clearUserInfo());
      }
    } catch (error) {
      console.error('토큰 에러:', error);
      dispatch(clearUserInfo());
    }
  };

  useEffect(() => {
    const jwtFromCookie = cookiesFunction.getCookie('jwt');
    if (jwtFromCookie) {
      checkToken();
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path='/main' element={<MainPage/>}/>
    </Routes>
  );
};

export default App;
