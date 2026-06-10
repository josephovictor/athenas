import { redirect } from 'next/navigation';

export default function Home() {
  // This sends users straight to your setup form
  redirect('/setup');
}