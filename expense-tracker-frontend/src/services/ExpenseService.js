import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export const getAllExpenses   = (userId)            =>
    axios.get(`${BASE_URL}/expenses/user/${userId}`);

export const createExpense    = (expense)           =>
    axios.post(`${BASE_URL}/expenses`, expense);

export const updateExpense    = (id, expense, userId) =>
    axios.put(`${BASE_URL}/expenses/${id}${userId ? `?userId=${userId}` : ''}`, expense);

export const deleteExpense    = (id, userId)         =>
    axios.delete(`${BASE_URL}/expenses/${id}${userId ? `?userId=${userId}` : ''}`);

export const importGuestExpenses = (userId, expenses) =>
    axios.post(`${BASE_URL}/expenses/import?userId=${userId}`, { userId, expenses });

export const getMonthlyTotal  = (userId, month, year) =>
    axios.get(`${BASE_URL}/expenses/total?userId=${userId}&month=${month}&year=${year}`);

export const getByCategory    = (userId, category)    =>
    axios.get(`${BASE_URL}/expenses/category?userId=${userId}&category=${category}`);