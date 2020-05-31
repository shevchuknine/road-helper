import Api, {API_PATH} from "./api";
import {Cookie, deleteCookie, setCookie} from "../helpers/cookie";

export const signUp = (email, password) => {
    return Api.client.post(`${API_PATH}/api/v1/reg/pwd/email`, {
        email, password
    }).catch(response => {
        const {dsc} = response;
        return Promise.reject(dsc);
    });
};

export const logIn = (email, password) => {
    return Api.client.post(`${API_PATH}/api/v1/login/pwd/email`, {
        email, password
    }).then((response) => {
        const {res} = response;
        if (res) {
            const {token} = res;
            const currentTimeWith30Minutes = new Date((new Date()).getTime() + 1000 * 60 * 60 * 24);
            setCookie(Cookie.authorization, `Bearer ${token}`, {expires: currentTimeWith30Minutes});
        }
    }, (response) => {
        const {dsc} = response;
        return Promise.reject(dsc);
    });
};

export const signOut = () => {
    deleteCookie(Cookie.authorization);
    return Promise.resolve();
};
