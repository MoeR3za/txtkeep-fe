'use client';

import axios from "axios";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    validateStatus: function (status) {
        if (status === 403) {
            window.location.href = "/login";
            return false;
        }
        return status >= 200 && status < 300;
    }
});