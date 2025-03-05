import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // ✅ Backend URL

export const registerUser = async (username, password) => {
    return axios.post(`${API_BASE_URL}/register`, { username, password });
};

export const loginUser = async (username, password) => {
    return axios.post(`${API_BASE_URL}/login`, { username, password });
};
