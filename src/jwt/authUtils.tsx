import { jwtDecode } from 'jwt-decode';

function isTokenExpired(token: string | null): boolean {
  if (!token || token.split('.').length !== 3) {
    console.error('Invalid token specified: missing part #2');
    return true; // Treat invalid tokens as expired
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime; // Check if token has expired
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // If there's any error decoding the token, treat it as expired
  }
}

export default isTokenExpired;