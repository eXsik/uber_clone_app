const http = () => {
    let options = {
        baseUrl: 'http://localhost',
        headers: {}
    };

    if (localStorage.getItem('token')) {
        options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    return axios.create();
};

export default http;