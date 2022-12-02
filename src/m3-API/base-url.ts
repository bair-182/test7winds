import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://185.244.172.108:8081',
});