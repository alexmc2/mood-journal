// Import the necessary types from Next.js
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../utils/db'; 

// Your API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const SECRET_TOKEN = process.env.CRON_SECRET;
  const authorizationHeader = req.headers['authorization'];

  // Check if the token matches
  if (authorizationHeader === `Bearer ${SECRET_TOKEN}`) {
    try {
     
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
      res.status(200).json({
        success: true,
        message: 'Cleanup successful',
        deletedChats: emptyChats.length,
      });
    } catch (error) {
      // Handle potential errors
      res.status(500).json({
        success: false,
        message: 'Cleanup failed',
        error: error,
      });
    }
  } else {
    // Unauthorized or Method Not Allowed
    res.status(401).end('Unauthorized');
  }
}
