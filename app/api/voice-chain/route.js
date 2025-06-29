import { NextResponse } from 'next/server';
import { verificarDisponibilidade, confirmarAgendamento } from '@/lib/actions';

const tools = [
  {
    type: 'function',
    name: 'verificar_disponibilidade_medico',
    description:
      'Verifica se há um horário disponível para uma consulta com um médico por nome ou especialidade em uma data e hora específicas. Sempre deve ser a primeira chamada.',
    parameters: {
      type: 'object',
      properties: {
        especialidade: {
          type: 'string',
          description: 'Nome da especialidade médica desejada.',
        },
        nome_medico: {
          type: 'string',
          description: 'O nome do médico desejado.',
        },
        data: {
          type: 'string',
          description: 'Data da consulta no formato AAAA-MM-DD.',
        },
        hora: {
          type: 'string',
          description: 'Hora da consulta no formato HH:MM (24h).',
        },
      },
      required: ['data', 'hora'],
    },
  },
  {
    type: 'function',
    name: 'confirmar_agendamento_consulta',
    description:
      'Agenda a consulta após confirmação verbal. Só deve ser chamada após encontrar um horário disponível e o paciente concordar.',
    parameters: {
      type: 'object',
      properties: {
        medicoId: {
          type: 'number',
          description: 'O ID numérico do médico, retornado pela função anterior.',
        },
        dataHora: {
          type: 'string',
          description: 'A data/hora no formato ISO 8601.',
        },
      },
      required: ['medicoId', 'dataHora'],
    },
  },
];

const systemPrompt = `Você é o assistente de voz de agendamentos da BrailleWay.
Fale sempre em português.

**IMPORTANTE**:
- Todos os horários fornecidos pelo paciente estão no fuso America/Sao_Paulo (-03:00) e devem permanecer nesse fuso.
- Não converta para UTC ou outros fusos ao interagir com funções.

**AGENDAMENTO POR ESPECIALIDADE**:
- Quando o paciente mencionar apenas uma especialidade (ex: "psicologia", "cardiologia"), use a função verificar_disponibilidade_medico com o parâmetro "especialidade".
- O sistema automaticamente escolherá o melhor médico disponível baseado em:
  * Proximidade do horário desejado
  * Flexibilidade de agenda
  * Menor ocupação
- Se houver múltiplos médicos com scores similares, o sistema apresentará as opções e você deve ajudar o paciente a escolher.

**EXEMPLOS DE USO**:
- "Quero agendar com psicólogo amanhã às 14h" → use especialidade: "psicologia"
- "Preciso de cardiologista na sexta às 10h" → use especialidade: "cardiologia"
- "Dr. João Silva, amanhã às 15h" → use nome_medico: "João Silva"

**CONFIRMAÇÕES**:
- Sempre confirme os detalhes antes de agendar
- Se houver múltiplas opções, apresente-as claramente
- Aguarde a confirmação do paciente antes de prosseguir

**TRATAMENTO DE ERROS**:
- Se o sistema retornar "Nenhum médico com essa especialidade", sugira outras especialidades similares
- Se retornar "O horário solicitado não está disponível", sugira horários alternativos
- Se retornar "Médico sem disponibilidades configuradas", informe que o médico ainda não configurou sua agenda
- Se retornar "Não é possível agendar no passado", peça uma data futura
- Se retornar "Data ou hora inválida", peça para o paciente repetir a data e hora

**FLUXO DE AGENDAMENTO**:
1. Coletar especialidade ou nome do médico
2. Coletar data e hora desejadas
3. Verificar disponibilidade usando verificar_disponibilidade_medico
4. Se houver confirmação necessária, aguardar resposta do paciente
5. Se disponível, confirmar agendamento usando confirmar_agendamento_consulta
6. Informar sucesso ou erro ao paciente`;

export async function POST(req) {
  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });
  }

  const form = await req.formData();
  const audio = form.get('audio');
  const messages = JSON.parse(form.get('messages') || '[]');

  if (!audio || !(audio instanceof Blob)) {
    return NextResponse.json({ error: 'Audio file missing.' }, { status: 400 });
  }

  const transcribeFd = new FormData();
  transcribeFd.append('file', audio, 'audio.webm');
  transcribeFd.append('model', 'gpt-4o-transcribe');
  transcribeFd.append('response_format', 'text');

  const transcriptRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAIKey}`,
    },
    body: transcribeFd,
  });

  if (!transcriptRes.ok) {
    return NextResponse.json({ error: 'Failed to transcribe audio.' }, { status: 500 });
  }

  const transcript = await transcriptRes.text();
  messages.push({ role: 'user', content: transcript });

  let completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAIKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools,
    }),
  });

  if (!completionRes.ok) {
    const err = await completionRes.text();
    console.error('Chat completion failed:', err);
    return NextResponse.json({ error: 'Chat completion failed.' }, { status: 500 });
  }

  const completionData = await completionRes.json();
  let message = completionData.choices[0].message;

  if (message.tool_calls && message.tool_calls.length) {
    const call = message.tool_calls[0];
    const name = call.function.name;
    const args = JSON.parse(call.function.arguments || '{}');
    let output = {};
    try {
      if (name === 'verificar_disponibilidade_medico') {
        output = await verificarDisponibilidade(args);
      } else if (name === 'confirmar_agendamento_consulta') {
        output = await confirmarAgendamento(args);
      }
    } catch (e) {
      output = { error: e.message };
    }
    messages.push({ role: 'assistant', tool_calls: [call] });
    messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output) });

    completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });

    if (!completionRes.ok) {
      const err2 = await completionRes.text();
      console.error('Chat completion failed 2:', err2);
      return NextResponse.json({ error: 'Chat completion failed.' }, { status: 500 });
    }
    const data2 = await completionRes.json();
    message = data2.choices[0].message;
  }

  let audioBase64 = null;
  if (message.content) {
    const speechRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4o-mini-tts', input: message.content, voice: 'nova' }),
    });
    if (speechRes.ok) {
      const buf = Buffer.from(await speechRes.arrayBuffer());
      audioBase64 = buf.toString('base64');
    } else {
      const err3 = await speechRes.text();
      console.error('Speech synthesis failed:', err3);
    }
  }

  return NextResponse.json({ transcript, response: message.content || null, audio: audioBase64, messages });
}