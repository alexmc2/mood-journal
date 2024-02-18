import { prisma } from '@/utils/db';
import { getUserByClerkId } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: Request | NextRequest, { params }: any) => {
  const user = await getUserByClerkId();

  // Retrieve the page number from the request parameters
  const page = (parseInt(params.page) || 1) - 1;

  const itemsPerPage = 9;
  try {
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      skip: page * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        analysis: true,
      },
    });

    const totalEntries = await prisma.journalEntry.count({
      where: { userId: user.id },
    });

    const pageCount = Math.ceil(totalEntries / itemsPerPage);

    return NextResponse.json({ data: journalEntries, pageCount });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
