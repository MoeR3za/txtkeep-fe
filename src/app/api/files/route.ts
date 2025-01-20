'use server';

import { cookies } from 'next/headers';
import backendAPI from "@/app/api/util/server";

export async function GET(req: Request) {
    const cookieStore = cookies();
    const searchQuery = new URL(req.url).searchParams.toString();

    try {
        const response = await backendAPI.get(
            searchQuery ? `api/files/?${searchQuery}` : `api/files/`
        , {
            headers: {
                authorization: `Bearer ${cookieStore.get('token')?.value}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return Response.json({ success: false, ...data }, { status: response.status });
        }

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error }, { status: 401 });
    }
}

export async function POST(request: Request) {
    const cookieStore = cookies();
    const formData = await request.formData();

    try {
        const response = await backendAPI.post('api/files/', formData, {
            headers: {
                authorization: `Bearer ${cookieStore.get('token')?.value}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return Response.json({ success: false, ...data }, { status: response.status });
        }

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error: String(error) }, { status: 401 });
    }
}
