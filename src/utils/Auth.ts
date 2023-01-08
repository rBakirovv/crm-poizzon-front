export const BASE_URL = "http://localhost:3001";

const HEADERS = {
  "Content-Type": "application/json",
};

export const authorize = (email: string, password: string) => {
  return fetch(`${BASE_URL}/signin`, {
    credentials: "include",
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(checkResponse);
};

export const logOut = () => {
  return fetch(`${BASE_URL}/signout`, {
    credentials: "include",
    method: "DELETE",
    headers: HEADERS,
  }).then(checkResponse);
};

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
};
