import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://185.244.172.108:8081',
});
