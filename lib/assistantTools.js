export const tools = [
  {
    type: 'function',
    function: {
      name: 'verificar_disponibilidade_medico',
      description:
        'Verifica se h\u00e1 um hor\u00e1rio dispon\u00edvel para uma consulta com um m\u00e9dico por nome ou especialidade em uma data e hora espec\u00edficas. Sempre deve ser a primeira chamada.',
      parameters: {
        type: 'object',
        properties: {
          especialidade: {
            type: 'string',
            description: 'Nome da especialidade m\u00e9dica desejada.',
          },
          nome_medico: {
            type: 'string',
            description: 'O nome do m\u00e9dico desejado.',
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
  },
  {
    type: 'function',
    function: {
      name: 'confirmar_agendamento_consulta',
      description:
        'Agenda a consulta ap\u00f3s confirma\u00e7\u00e3o verbal. S\u00f3 deve ser chamada ap\u00f3s encontrar um hor\u00e1rio dispon\u00edvel e o paciente concordar.',
      parameters: {
        type: 'object',
        properties: {
          medicoId: {
            type: 'number',
            description:
              'O ID num\u00e9rico do m\u00e9dico, retornado pela fun\u00e7\u00e3o anterior.',
          },
          dataHora: {
            type: 'string',
            description: 'A data/hora no formato ISO 8601.',
          },
        },
        required: ['medicoId', 'dataHora'],
      },
    },
  },
];