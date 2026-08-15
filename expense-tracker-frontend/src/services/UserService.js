import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export const getUserById = (id) =>
    axios.get(`${BASE_URL}/users/${id}`);

export const updateUser = (id, userData) =>
    axios.put(`${BASE_URL}/users/${id}`, userData);

export const updateProfilePicture = (id, base64Image) =>
    axios.put(`${BASE_URL}/users/${id}/profile-picture`, { profilePicture: base64Image });
