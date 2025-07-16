// file: app/video/[consultaId]/page.js

import VideoCall from '@/components/VideoCall';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// Acessando 'params' como argumento da função
export default async function VideoPage({ params }) {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  // Desestruturando o ID a partir do objeto 'params'
  const { consultaId } = params;

  return (
    <div className="w-full h-screen">
      <VideoCall consultaId={consultaId} />
    </div>
  );
}