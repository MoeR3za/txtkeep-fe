'use server';

import { cookies, headers } from 'next/headers';
import backendClient from "@/app/api/util/server";

export async function POST() {
    const cookieStore = cookies();

    try {
        await backendClient.post(`/auth/logout/`, {
            headers: {
                authorization: `Bearer ${cookieStore.get('token')?.value}`
            }
        });
        cookieStore.set('token', "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0),
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false, error }, { status: 401 });
    }
}
