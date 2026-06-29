import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  try {
    // Check if a coordinator already exists in the database
    const coordinatorExists = await prisma.user.findFirst({
      where: { role: 'coordinator' },
    });

    if (coordinatorExists) {
      redirect('/login');
    } else {
      redirect('/setup');
    }
  } catch (error) {
    // Re-throw Next.js redirect errors (they use throw internally)
    if (error instanceof Error && 'digest' in error) {
      throw error;
    }
    console.error('Database connection error:', error);
    // If database is unreachable, default to setup page
    redirect('/setup');
  }
}