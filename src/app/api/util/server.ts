const headers = { 'Content-Type': 'application/json' };

const api = {
    get: async (endpoint: string, options: RequestInit = {}) => {
        return await fetch(`${process.env.API_URL}/${endpoint}`, {
            method: 'GET',
            headers,
            ...options,
        })
    },
    post: async (endpoint: string, body?: any, options: RequestInit = {}) => {
        return await fetch(`${process.env.API_URL}/${endpoint}`, {
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body),
            headers: body instanceof FormData ? {} : headers,
            ...options,
        })
    },
    put: async (endpoint: string, body?: any, options: RequestInit = {}) => {
        return await fetch(`${process.env.API_URL}/${endpoint}`, {
            method: 'PUT', 
            body: body instanceof FormData ? body : JSON.stringify(body),
            headers: body instanceof FormData ? {} : headers,
            ...options,
        })
    },
    delete: async (endpoint: string, options: RequestInit = {}) => {
        return await fetch(`${process.env.API_URL}/${endpoint}`, {
            method: 'DELETE',
            headers,
            ...options,
        })
    },
}

export default api;