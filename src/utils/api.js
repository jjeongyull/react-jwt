import cookiesFunction from './cookie';
import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'https://addit.menteimo.com/react_test/server/api.php',
  timeout: 5000, // 5초 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    // 요청 전 작업
    // const token = cookiesFunction.getCookie('jwt');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // 요청 오류 처리
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    // 응답 오류 처리
    if (error.response) {
      // 서버가 응답을 보냈으나 상태 코드가 2xx 범위 밖
      console.error('Response error:', error.response);
    } else if (error.request) {
      // 요청이 만들어졌으나 응답을 받지 못함
      console.error('No response received:', error.request);
    } else {
      // 요청 설정 중 문제 발생
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// POST 요청 함수
const postApi = async (data) => {
  try {
    const response = await api.post('', data);
    return response.data;
  } catch (error) {
    console.error('There was an error!', error);
    throw error;
  }
};

export default postApi;
