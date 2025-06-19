import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.2.126:4000/' 
})

export default api;