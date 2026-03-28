import axios from 'axios';

// Create an instance of axios
const apiClient = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

// Add a request interceptor
apiClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
apiClient.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

// Service exports
export const authService = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
};

export const characterService = {
    getCharacter: (id) => apiClient.get(`/character/${id}`),
    createCharacter: (data) => apiClient.post('/character', data),
};

export const vipService = {
    activateVIP: (id) => apiClient.post(`/vip/activate/${id}`),
    getVIPStatus: (id) => apiClient.get(`/vip/status/${id}`),
};
