/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import axios, {AxiosResponse} from "axios";

export interface responsePayload {
    success: boolean;
    result: any;
    message: string;
}

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) =>         
        axios
        .get(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url)
        .then(responseBody)
        .catch((error) => error.response?.data || error),

    post: (url: string, body: {}) => 
        axios
            .post(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
            .then(responseBody)
            .catch((error) => error.response?.data || error),

    put: (url: string, body: {}) => 
        axios
            .put(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
            .then(responseBody)
            .catch((error) => error.response?.data || error),

    del: (url: string) => 
        axios
            .delete(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url)
            .then(responseBody)
            .catch((error) => error.response?.data || error),

    patch: (url: string, body: any) => 
        axios
            .patch(process.env.NEXT_PUBLIC_BASE_API_PREFIX + url, body)
            .then(responseBody)
            .catch((error) => error.response?.data || error),
};

const Api = {
    get: async (url: string) => {
        try {
            return await requests.get(url);
        } catch (error) {
            throw error;
        }
    } ,
    post: async (url: string, body: {}) => {
        try {
            return await requests.post(url, body);
        } catch (error) {
            throw error;
        }
    },
    put: async (url: string, body: {}) => {
        try {
            return await requests.put(url, body);
        } catch (error) {
            throw error;
        }
    } ,
    del: async (url: string) =>  {
        try {
            return await requests.del(url);
        } catch (error) {
            throw error;
        }
    },
    patch: async (url: string, body: {}) => {
        try {
            return await requests.patch(url, body);
        } catch (error) {
            throw error;
        }
    },
};

export default Api;