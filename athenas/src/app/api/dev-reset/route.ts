import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    // 1. Verify the secret matches your .env file
    if (secret !== process.env.RESET_SECRET) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Secret' }, { status: 401 });
    }

    // 2. Wipe the database (deleting Cohort and User cascades to all other tables)
    await prisma.cohort.deleteMany({});
    await prisma.user.deleteMany({});

    // 3. Re-seed ONLY the default Cohort (No Coordinator)
    await prisma.cohort.create({
      data: {
        name: "Prototype Cohort",
        academic_year: "2024/2025",
        portal_state: {
          create: {
            seminar_portal_open: false,
            project_portal_open: false
          }
        }
      }
    });

    return NextResponse.json({ message: 'Database wiped clean. Ready for Coordinator First-Time Setup.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Reset failed due to a server error.' }, { status: 500 });
  }
}