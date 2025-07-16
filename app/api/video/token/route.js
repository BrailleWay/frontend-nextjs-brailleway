// file: app/api/video/token/route.js

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import Twilio from 'twilio';

const { AccessToken } = Twilio.jwt;
const { VideoGrant } = AccessToken;

export async function POST(req) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { roomName, consultaId } = await req.json();

  if (!roomName || !consultaId) {
    return NextResponse.json({ error: 'Nome da sala e ID da consulta são obrigatórios' }, { status: 400 });
  }

  try {
    const consulta = await prisma.consulta.findUnique({
      where: { id: Number(consultaId) },
    });

    if (!consulta) {
      return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    }

    const userId = Number(session.user.id);
    const userRole = session.user.role;

    // A CORREÇÃO ESTÁ AQUI 👇
    // Usamos camelCase (pacienteId) em vez de snake_case (paciente_id)
    const isPatient = userRole === 'paciente' && consulta.pacienteId === userId;
    const isDoctor = userRole === 'medico' && consulta.medicoId === userId;

    if (!isPatient && !isDoctor) {
      return NextResponse.json({ error: 'Acesso negado a esta consulta' }, { status: 403 });
    }

    // Geração do token Twilio
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioApiKeySid = process.env.TWILIO_API_KEY_SID;
    const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

    const token = new AccessToken(twilioAccountSid, twilioApiKeySid, twilioApiKeySecret, {
      identity: session.user.name,
    });

    const videoGrant = new VideoGrant({
      room: roomName,
    });

    token.addGrant(videoGrant);

    return NextResponse.json({ token: token.toJwt() });

  } catch (error) {
    console.error('Erro ao gerar token do Twilio:', error);
    return NextResponse.json({ error: 'Erro interno ao gerar o token de vídeo.' }, { status: 500 });
  }
}