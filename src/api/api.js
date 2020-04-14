import axios from "axios";

class ApiClient {
    axios;

    constructor() {
        this.axios = axios.create();

        const responseSuccessInterceptor = (response) => {
            return response.data;
        };

        const responseErrorInterceptor = (error) => {
            const {response: {data}} = error;
            return Promise.reject(data);
        };

        this.axios.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);
    }

    get client() {
        if (!this.axios) {
            throw "Create instance of ApiClient!"
        }

        return this.axios;
    }
}

const Api = new ApiClient();
export default Api;
