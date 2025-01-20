'use server';

import backendAPI from "@/app/api/util/server";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = cookies();

    try {
        // Send login request to Django API
        const data = await request.json();
        const { username, password } = data;
        const response = await backendAPI.post('auth/login', {
            username,
            password,
        });
        
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        
        const { access } = await response.json();
        cookieStore.set('token', access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: '/',
          maxAge: 60 * 60 * 24, // 1 day in seconds
        });
      
        return Response.json({ success: true });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error }, { status: 403 });
    }
}
