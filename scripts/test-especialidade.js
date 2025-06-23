// =============================
// scripts/test-especialidade.js
// Teste da funcionalidade de agendamento por especialidade
// =============================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEspecialidade() {
  console.log("🧪 Testando agendamento por especialidade...\n");

  try {
    // 1. Verificar médicos existentes
    const medicos = await prisma.medico.findMany({
      include: { especialidade: true }
    });
    
    console.log("📋 Médicos cadastrados:");
    medicos.forEach(m => {
      console.log(`  - ${m.nome} (${m.especialidade.nome})`);
    });

    // 2. Verificar disponibilidades
    console.log("\n📅 Disponibilidades:");
    const disponibilidades = await prisma.disponibilidadeMedico.findMany({
      include: { medico: { include: { especialidade: true } } }
    });
    
    disponibilidades.forEach(d => {
      console.log(`  - ${d.medico.nome} (${d.medico.especialidade.nome}): ${d.diaSemana} ${d.horaInicio.toTimeString().slice(0,5)}-${d.horaFim.toTimeString().slice(0,5)}`);
    });

    // 3. Testar busca por especialidade
    console.log("\n🔍 Testando busca por especialidade 'Psicologia':");
    const psicologos = await prisma.medico.findMany({
      where: {
        ativo: true,
        especialidade: { 
          nome: { contains: "psicologia", mode: "insensitive" } 
        },
      },
      include: { especialidade: true }
    });
    
    console.log(`Encontrados ${psicologos.length} psicólogos:`);
    psicologos.forEach(p => {
      console.log(`  - ${p.nome} (${p.especialidade.nome})`);
    });

    // 4. Simular verificação de disponibilidade
    console.log("\n⏰ Simulando verificação de disponibilidade para amanhã às 14h:");
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(14, 0, 0, 0);
    
    const diaSemana = amanha.getDay();
    const horaDesejada = new Date(`1970-01-01T14:00:00`);
    
    console.log(`Dia da semana: ${diaSemana} (${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][diaSemana]})`);
    console.log(`Hora desejada: ${horaDesejada.toTimeString().slice(0,5)}`);

    // Verificar disponibilidades para cada médico
    for (const medico of psicologos) {
      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: {
          medicoId: medico.id,
          diaSemana,
          horaInicio: { lte: horaDesejada },
          horaFim: { gt: horaDesejada },
        },
      });
      
      if (disponibilidade) {
        console.log(`  ✅ ${medico.nome}: Disponível`);
        
        // Verificar conflitos
        const conflito = await prisma.consulta.findFirst({
          where: {
            medicoId: medico.id,
            status: { notIn: ["cancelada"] },
            dataHora: { lt: new Date(amanha.getTime() + 30 * 60000) },
            dataHoraFim: { gt: amanha },
          },
        });
        
        if (conflito) {
          console.log(`    ⚠️  Conflito com consulta #${conflito.id}`);
        } else {
          console.log(`    ✅ Horário livre!`);
        }
      } else {
        console.log(`  ❌ ${medico.nome}: Fora do horário de atendimento`);
      }
    }

  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste
testEspecialidade(); 