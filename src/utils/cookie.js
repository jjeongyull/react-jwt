const cookiesFunction = {};

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // 쿠키 이름과 값 분리
    const [cookieName, cookieValue] = cookie.split('=');
    // 쿠키 이름과 주어진 이름이 같으면 해당 값 반환
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  // 해당 이름을 가진 쿠키가 없으면 null 반환
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

cookiesFunction.setCookie = setCookie;
cookiesFunction.getCookie = getCookie;
cookiesFunction.deleteCookie = deleteCookie;

export default cookiesFunction;