import axios from 'axios';

const API_BASE_URL = 'http://api.ayulankamedical.com:9090/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const login_api = async (formData) => {
    try {
        const response = await api.post('/user/login', formData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}