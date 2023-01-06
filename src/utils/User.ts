export const BASE_URL = 'http://localhost:3001';

const HEADERS = {
  'Content-Type': 'application/json',
}

export const getUserInfo = () => {
  return fetch(`${BASE_URL}/users/me`, {
    credentials: 'include',
    method: 'GET',
    headers: HEADERS
  })
    .then(checkResponse);
};

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
};