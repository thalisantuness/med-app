import axios from 'axios';

const api = axios.create({
    baseURL: 'https://med-api-production-3ca1.up.railway.app/' 
})

export default api;