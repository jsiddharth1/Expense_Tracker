import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8081/api';

export const getAllExpenses   = (userId)            =>
    axios.get(`${BASE_URL}/expenses/user/${userId}`);

export const createExpense    = (expense)           =>
    axios.post(`${BASE_URL}/expenses`, expense);

export const updateExpense    = (id, expense)        =>
    axios.put(`${BASE_URL}/expenses/${id}`, expense);

export const deleteExpense    = (id)                 =>
    axios.delete(`${BASE_URL}/expenses/${id}`);

export const getMonthlyTotal  = (userId, month, year) =>
    axios.get(`${BASE_URL}/expenses/total?userId=${userId}&month=${month}&year=${year}`);

export const getByCategory    = (userId, category)    =>
    axios.get(`${BASE_URL}/expenses/category?userId=${userId}&category=${category}`);