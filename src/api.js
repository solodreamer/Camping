import axios from "axios";

/**
 * 創建一個 axios 實例
 */
const api = axios.create({
baseURL: process.env.REACT_APP_API_URL,
headers: {
    'Content-Type': 'application/json',
}
});

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export {api, setAuthToken};