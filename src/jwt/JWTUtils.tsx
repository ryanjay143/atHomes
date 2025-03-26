import { jwtDecode }  from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

export const storeToken = (token: string) => {
  localStorage.setItem('jwtToken', token);
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

export const isTokenExpired = (token: string): boolean => {
  const decoded: DecodedToken = jwtDecode(token);
  return decoded.exp < Date.now() / 1000;
};

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode(token);
};
