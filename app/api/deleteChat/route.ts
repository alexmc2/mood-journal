// app/api/deleteChat/route.ts
import { prisma } from '../../../utils/db'; 

// Named export for the POST method
export async function POST(req: Request) {
  // Extract the SECRET_TOKEN from your environment variables
  const SECRET_TOKEN = process.env.CRON_SECRET;
  // Extract the Authorization header from the incoming request
  const authorizationHeader = req.headers.get('authorization');

  // Check if the token in the Authorization header matches your SECRET_TOKEN
  if (authorizationHeader === `Bearer ${SECRET_TOKEN}`) {
    try {
      // Perform the cleanup task: find and delete empty chats
      const emptyChats = await prisma.chat.findMany({
        where: {
          messages: {
            none: {},
          },
        },
      });

   
      for (const chat of emptyChats) {
        await prisma.chat.delete({
          where: {
            id: chat.id,
          },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Cleanup successful',
          deletedChats: emptyChats.length,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      // If an error occurs, return a response indicating the cleanup failed
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Cleanup failed',
          error: error,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } else {
    // If the Authorization header does not match, return an Unauthorized response
    return new Response('Unauthorized', { status: 401 });
  }
}

// 