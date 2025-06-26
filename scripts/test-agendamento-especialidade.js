// =============================
// scripts/test-agendamento-especialidade.js
// Teste específico para agendamento por especialidade
// =============================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAgendamentoEspecialidade() {
  console.log("🧪 Testando agendamento por especialidade...\n");

  try {
    // 1. Verificar especialidades disponíveis
    const especialidades = await prisma.especialidade.findMany({
      where: { ativo: true },
      include: {
        medicos: {
          where: { ativo: true },
          include: { disponibilidades: true }
        }
      }
    });

    console.log("📋 Especialidades e médicos:");
    especialidades.forEach(esp => {
      console.log(`\n🏥 ${esp.nome}:`);
      if (esp.medicos.length === 0) {
        console.log("   ❌ Nenhum médico cadastrado");
      } else {
        esp.medicos.forEach(m => {
          const temDisponibilidade = m.disponibilidades.length > 0;
          console.log(`   ${temDisponibilidade ? '✅' : '❌'} ${m.nome} (CRM: ${m.crm}) - Disponibilidades: ${m.disponibilidades.length}`);
        });
      }
    });

    // 2. Testar busca por especialidade específica
    console.log("\n🔍 Testando busca por 'Psicologia':");
    const psicologos = await prisma.medico.findMany({
      where: {
        ativo: true,
        especialidade: { 
          nome: { contains: "psicologia", mode: "insensitive" } 
        },
      },
      include: { 
        especialidade: true,
        disponibilidades: true
      }
    });

    console.log(`Encontrados ${psicologos.length} psicólogos:`);
    psicologos.forEach(p => {
      console.log(`   - ${p.nome} (${p.especialidade.nome}) - Disponibilidades: ${p.disponibilidades.length}`);
    });

    // 3. Simular verificação de disponibilidade
    console.log("\n⏰ Simulando verificação de disponibilidade:");
    
    // Data de amanhã às 14h
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(14, 0, 0, 0);
    
    const diaSemana = amanha.getDay();
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    console.log(`   Data: ${amanha.toLocaleDateString('pt-BR')} (${dias[diaSemana]})`);
    console.log(`   Hora: 14:00`);
    console.log(`   Dia da semana: ${diaSemana}`);

    // 4. Verificar disponibilidades para esse horário
    console.log("\n📅 Verificando disponibilidades para o horário:");
    
    for (const medico of psicologos) {
      console.log(`\n   👨‍⚕️ ${medico.nome}:`);
      
      if (medico.disponibilidades.length === 0) {
        console.log("      ❌ Sem disponibilidades configuradas");
        continue;
      }

      // Verificar se tem disponibilidade para o dia da semana
      const disponibilidadeDia = medico.disponibilidades.find(d => d.diaSemana === diaSemana);
      if (!disponibilidadeDia) {
        console.log(`      ❌ Não atende ${dias[diaSemana]}`);
        continue;
      }

      // Verificar se o horário está dentro da disponibilidade
      const horaInicio = disponibilidadeDia.horaInicio.getHours();
      const horaFim = disponibilidadeDia.horaFim.getHours();
      const horaDesejada = 14;

      if (horaDesejada >= horaInicio && horaDesejada < horaFim) {
        console.log(`      ✅ Disponível: ${horaInicio}:00 - ${horaFim}:00`);
        
        // Verificar conflitos com consultas existentes
        const conflito = await prisma.consulta.findFirst({
          where: {
            medicoId: medico.id,
            status: { notIn: ["cancelada"] },
            dataHora: { 
              gte: new Date(amanha.getTime() - 30 * 60 * 1000), // 30 min antes
              lt: new Date(amanha.getTime() + 30 * 60 * 1000)   // 30 min depois
            }
          }
        });

        if (conflito) {
          console.log(`      ⚠️  Conflito com consulta existente`);
        } else {
          console.log(`      🎯 Horário livre para agendamento`);
        }
      } else {
        console.log(`      ❌ Fora do horário de atendimento (${horaInicio}:00 - ${horaFim}:00)`);
      }
    }

    // 5. Sugestões de melhoria
    console.log("\n💡 Sugestões de melhoria:");
    
    const medicosSemDisponibilidade = psicologos.filter(m => m.disponibilidades.length === 0);
    if (medicosSemDisponibilidade.length > 0) {
      console.log("   - Médicos sem disponibilidade configurada:");
      medicosSemDisponibilidade.forEach(m => {
        console.log(`     * ${m.nome} (${m.crm})`);
      });
    }

    const medicosComDisponibilidade = psicologos.filter(m => m.disponibilidades.length > 0);
    if (medicosComDisponibilidade.length === 0) {
      console.log("   - Nenhum psicólogo com disponibilidade configurada");
      console.log("   - Configure disponibilidades para os médicos cadastrados");
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAgendamentoEspecialidade(); 