// =============================
// scripts/test-ia-completo.js
// Teste completo do fluxo da IA realtime
// =============================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simular as funções da IA
const normalizeEspecialidade = (e) =>
  (e || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const toISOWithTimezone = (dateStr, hourStr) => {
  const TZ = "America/Sao_Paulo";
  const dayjs = require('dayjs');
  const utc = require('dayjs/plugin/utc');
  const timezone = require('dayjs/plugin/timezone');
  
  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  return dayjs
    .tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ)
    .toISOString();
};

const parseDateTimeWithTimezone = (dateStr, hourStr) => {
  const TZ = "America/Sao_Paulo";
  const dayjs = require('dayjs');
  const utc = require('dayjs/plugin/utc');
  const timezone = require('dayjs/plugin/timezone');
  
  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  return dayjs.tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ).toDate();
};

async function testIACompleto() {
  console.log("🤖 Teste completo da IA realtime...\n");

  try {
    // Cenários de teste
    const cenarios = [
      {
        nome: "Agendamento por especialidade - Psicologia",
        criteria: {
          especialidade: "psicologia",
          data: "2025-06-26", // Quinta-feira
          hora: "14:00"
        }
      },
      {
        nome: "Agendamento por especialidade - Dermatologia",
        criteria: {
          especialidade: "dermatologia",
          data: "2025-06-28", // Sábado
          hora: "10:00"
        }
      },
      {
        nome: "Agendamento por especialidade - Especialidade inexistente",
        criteria: {
          especialidade: "astronomia",
          data: "2025-06-26",
          hora: "14:00"
        }
      },
      {
        nome: "Agendamento por especialidade - Horário indisponível",
        criteria: {
          especialidade: "psicologia",
          data: "2025-06-26", // Quinta-feira
          hora: "20:00" // Fora do horário
        }
      }
    ];

    for (const cenario of cenarios) {
      console.log(`\n🧪 ${cenario.nome}`);
      console.log("=" .repeat(50));
      
      const resultado = await simularVerificacaoDisponibilidade(cenario.criteria);
      
      console.log("📋 Resultado:");
      console.log(`   Disponível: ${resultado.disponivel}`);
      console.log(`   Motivo: ${resultado.motivo}`);
      
      if (resultado.proximaAcao) {
        console.log(`   Próxima ação: ${resultado.proximaAcao.funcao}`);
        console.log(`   Argumentos: ${JSON.stringify(resultado.proximaAcao.argumentos)}`);
      }
      
      if (resultado.precisaConfirmar) {
        console.log(`   Precisa confirmar: ${resultado.precisaConfirmar}`);
        console.log(`   Sugestões: ${resultado.sugestoes?.join(', ')}`);
      }
      
      console.log("");
    }

    // Teste de confirmação de agendamento
    console.log("\n🎯 Teste de confirmação de agendamento");
    console.log("=" .repeat(50));
    
    const agendamentoTeste = {
      medicoId: 2, // Eduardo Amaro
      dataHora: toISOWithTimezone("2025-06-26", "14:00")
    };
    
    console.log("📋 Tentando agendar consulta:");
    console.log(`   Médico ID: ${agendamentoTeste.medicoId}`);
    console.log(`   Data/Hora: ${agendamentoTeste.dataHora}`);
    
    // Simular confirmação (sem criar realmente a consulta)
    console.log("✅ Simulação de confirmação bem-sucedida");
    console.log("   Consulta seria agendada com sucesso!");

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function simularVerificacaoDisponibilidade(criteria) {
  console.log(`[INPUT] criteria: ${JSON.stringify(criteria)}`);

  try {
    // Validação rápida de entrada
    if (!criteria?.data || !criteria?.hora) {
      return { disponivel: false, motivo: "Data e hora são obrigatórias." };
    }

    // Seleção de médicos por especialidade
    let medicos = [];
    if (criteria.especialidade) {
      const esp = normalizeEspecialidade(criteria.especialidade);
      medicos = await prisma.medico.findMany({
        where: {
          ativo: true,
          especialidade: { 
            nome: { contains: esp, mode: "insensitive" } 
          },
        },
        include: { especialidade: true }
      });
      if (medicos.length === 0) {
        return { disponivel: false, motivo: "Nenhum médico com essa especialidade." };
      }
      console.log(`[ESPECIALIDADE] Encontrados ${medicos.length} médicos para '${criteria.especialidade}'`);
    }

    if (medicos.length === 0) return { disponivel: false, motivo: "Nenhum médico encontrado." };

    // Parsing data/hora
    const dataHoraDesejada = parseDateTimeWithTimezone(criteria.data, criteria.hora);
    console.log(`[TIMEZONE DEBUG] Input: ${criteria.data} ${criteria.hora}`);
    console.log(`[TIMEZONE DEBUG] Parsed: ${dataHoraDesejada.toISOString()}`);
    
    if (isNaN(dataHoraDesejada.getTime())) return { disponivel: false, motivo: "Data ou hora inválida." };
    if (dataHoraDesejada < new Date()) return { disponivel: false, motivo: "Não é possível agendar no passado." };

    const diaSemana = dataHoraDesejada.getDay();
    const medicosDisponiveis = [];

    for (const medico of medicos) {
      console.log(`[CHECK] Médico #${medico.id} (${medico.nome})`);

      // Verificar se o médico tem disponibilidades configuradas
      const totalDisponibilidades = await prisma.disponibilidadeMedico.count({
        where: { medicoId: medico.id, disponivel: true }
      });
      
      if (totalDisponibilidades === 0) {
        console.log(`   ⚠️  Médico sem disponibilidades configuradas`);
        continue;
      }

      // Disponibilidade na grade semanal
      const horaDesejada = new Date(`1970-01-01T${dataHoraDesejada.getUTCHours().toString().padStart(2, '0')}:${dataHoraDesejada.getUTCMinutes().toString().padStart(2, '0')}:00Z`);
      
      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: {
          medicoId: medico.id,
          diaSemana,
          horaInicio: { lte: horaDesejada },
          horaFim: { gt: horaDesejada },
        },
      });
      if (!disponibilidade) {
        console.log(`   ↪️  Fora do horário de atendimento (diaSemana=${diaSemana}, hora=${horaDesejada.toTimeString().slice(0,5)})`);
        continue;
      }

      // Conflito com outras consultas
      const dataHoraFim = new Date(dataHoraDesejada.getTime() + 30 * 60 * 1000); // +30 min
      const conflito = await prisma.consulta.findFirst({
        where: {
          medicoId: medico.id,
          status: { notIn: ["cancelada"] },
          dataHora: { lt: dataHoraFim },
          dataHoraFim: { gt: dataHoraDesejada },
        },
      });
      if (conflito) {
        console.log("   ↪️  Conflito com consulta #" + conflito.id);
        continue;
      }

      // Disponível!
      console.log("   ✅  Horário livre!");
      
      // Calcular score simples
      const scoreTotal = 100; // Score padrão para simplicidade
      
      medicosDisponiveis.push({
        medico,
        disponibilidade,
        score: scoreTotal
      });
    }

    if (medicosDisponiveis.length === 0) {
      console.log("   ❌  Nenhum médico disponível no horário solicitado.");
      return { disponivel: false, motivo: "O horário solicitado não está disponível." };
    }

    // Escolher o melhor médico
    medicosDisponiveis.sort((a, b) => b.score - a.score);
    const melhorMedico = medicosDisponiveis[0];
    
    console.log(`🏆 Melhor médico escolhido: ${melhorMedico.medico.nome} (score: ${melhorMedico.score})`);

    return {
      disponivel: true,
      motivo: `Horário encontrado com ${melhorMedico.medico.nome} (${melhorMedico.medico.especialidade.nome}) em ${dataHoraDesejada.toLocaleString("pt-BR")}.`,
      proximaAcao: {
        funcao: "confirmar_agendamento_consulta",
        argumentos: { 
          medicoId: melhorMedico.medico.id, 
          dataHora: toISOWithTimezone(
            dataHoraDesejada.toISOString().split('T')[0], 
            dataHoraDesejada.toTimeString().slice(0, 5)
          )
        },
      },
    };
  } catch (err) {
    console.error("❌ Erro em verificarDisponibilidade:", err);
    return { disponivel: false, motivo: "Erro interno." };
  }
}

testIACompleto(); 