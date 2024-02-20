import { prisma } from '../../../utils/db'; // Adjust the import path as necessary

// Named export for the POST method
export async function POST(req: { headers: { get: (arg0: string) => any; }; }) {
  // Secret token you generated
  const SECRET_TOKEN = process.env.CRON_JWT_SECRET;
  const authorizationHeader = req.headers.get('authorization');

  // Check if the token matches
  if (authorizationHeader === `Bearer ${SECRET_TOKEN}`) {
    try {
      // Your cleanup logic here: find and delete empty chats
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

      // Return a success response
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
      // Handle potential errors
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Cleanup failed',
          error: error
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
    // Unauthorized or Method Not Allowed
    return new Response('Unauthorized', { status: 401 });
  }
}
