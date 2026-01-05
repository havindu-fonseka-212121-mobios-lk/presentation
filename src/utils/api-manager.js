import store from 'src/app/store';
import axios, { HttpStatusCode } from 'axios';
import { logoutAction } from '../reducers/auth.reducer';

// const { token } = store.getState().auth;

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
    // Authorization: `Bearer ${token}`,
  },
});

function handleResponse(response) {
  return {
    data: response.data,
    status: response.status,
  };
}

function handleError(error) {
  if (error.status === HttpStatusCode.Unauthorized) {
    store.dispatch(logoutAction());
  }

  throw error;
}

export const apiPostWithOptions = async ({ path, requestBody, header = {}, ...options }) => {
  const { token } = store.getState().auth;

  return http
    .post(path, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...header,
      },
      ...options, // This will include signal and other axios options
    })
    .then((response) => handleResponse(response))
    .catch((err) => handleError(err));
};

export const apiPost = async ({ path, requestBody, header = {} }) => {
  const { token } = store.getState().auth;

  return http
    .post(path, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => handleResponse(response))
    .catch((err) => handleError(err));
};
