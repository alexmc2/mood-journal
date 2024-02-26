// app/api/user/route.ts
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/utils/db';
import type { NextRequest } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function GET(request: NextRequest) {
  console.log('GET request received for /api/user');

  const { userId } = getAuth(request);
  console.log('Authenticated userId:', userId);

  if (!userId) {
    console.log('User not authenticated');
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Fetching user details from Clerk');
    const userDetails = await clerkClient.users.getUser(userId);
    console.log('User details fetched:', userDetails);

    console.log('Checking if user exists in database');
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.log('User not found in database, creating new user');
      const email = userDetails.emailAddresses[0].emailAddress;
      user = await prisma.user.create({
        data: { clerkId: userId, email },
      });
      console.log('New user created:', user);
    } else {
      console.log('User already exists in database');
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during user setup:', error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
