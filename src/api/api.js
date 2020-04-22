import axios from "axios";
import {Cookie, getCookie} from "../helpers/cookie";
import history from "../helpers/history";
import {Page} from "../components/pages/pages.constants";

class ApiClient {
    axios;

    constructor() {
        this.axios = axios.create();

        const responseSuccessInterceptor = (response) => {
            return response.data;
        };

        const responseErrorInterceptor = (error) => {
            const {response: {data, status}} = error;

            if (status === 401) {
                history.replace(Page.logIn);
            }

            return Promise.reject(data);
        };

        this.axios.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);

        const requestInterceptor = (request) => {
            return {
                ...request,
                headers: {
                    Authorization: getCookie(Cookie.authorization)
                }
            };
        };

        this.axios.interceptors.request.use(requestInterceptor);
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
