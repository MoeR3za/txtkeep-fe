'use server';

import { cookies } from 'next/headers';
import backendAPI from "@/app/api/util/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug
    const cookieStore = cookies();
    console.log("HERE", slug)
    try {
        const response = await backendAPI.get(`/api/files/${slug}`, {
            headers: {
                authorization: `Bearer ${cookieStore.get('token')?.value}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ success: false, error }, { status: 401 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug
    const cookieStore = cookies();

    try {
        const response = await backendAPI.delete(`/api/files/${slug}`, {
            headers: {
                authorization: `Bearer ${cookieStore.get('token')?.value}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ success: false, error }, { status: 401 });
    }
}
