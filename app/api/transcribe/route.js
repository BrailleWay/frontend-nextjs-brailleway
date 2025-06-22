import { experimental_transcribe } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio');
    if (!(audio instanceof Blob)) {
      return Response.json({ error: 'Audio not provided' }, { status: 400 });
    }
    const arrayBuffer = await audio.arrayBuffer();
    const result = await experimental_transcribe({
      model: openai.transcription('whisper-1'),
      audio: new Uint8Array(arrayBuffer),
    });
    return Response.json({ text: result.text });
  } catch (err) {
    console.error('Transcription error:', err);
    return Response.json({ error: 'Failed to transcribe' }, { status: 500 });
  }
}
