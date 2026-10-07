const { default: axios } = require("axios");

export const BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090"
).replace(/\/+$/, "");

export const clientServer = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
})