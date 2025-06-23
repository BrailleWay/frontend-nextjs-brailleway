const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDisponibilidade() {
  try {
    console.log('🧪 Testando verificação de disponibilidade...');
    
    // Buscar o médico Eduardo Amaro
    const medico = await prisma.medico.findFirst({
      where: {
        nome: {
          contains: 'Eduardo Amaro',
          mode: 'insensitive'
        }
      },
      include: {
        disponibilidades: true
      }
    });
    
    if (!medico) {
      console.log('❌ Médico Eduardo Amaro não encontrado!');
      return;
    }
    
    console.log(`✅ Médico encontrado: ${medico.nome} (ID: ${medico.id})`);
    console.log(`📅 Disponibilidades configuradas: ${medico.disponibilidades.length}`);
    
    // Testar uma data específica (próxima segunda-feira às 10:00)
    const dataTeste = new Date('2025-01-27T10:00:00.000Z'); // Segunda-feira
    const diaSemana = dataTeste.getDay();
    
    console.log(`\n🔍 Testando disponibilidade para: ${dataTeste.toLocaleString('pt-BR')}`);
    console.log(`📅 Dia da semana: ${diaSemana} (0=Domingo, 1=Segunda, etc.)`);
    
    // Verificar disponibilidade manualmente
    const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
      where: {
        medicoId: medico.id,
        diaSemana: diaSemana,
        horaInicio: { lte: dataTeste },
        horaFim: { gt: dataTeste },
      },
    });
    
    if (disponibilidade) {
      console.log('✅ Disponibilidade encontrada!');
      console.log(`   Horário: ${disponibilidade.horaInicio.toTimeString().slice(0,5)} - ${disponibilidade.horaFim.toTimeString().slice(0,5)}`);
    } else {
      console.log('❌ Nenhuma disponibilidade encontrada para este horário');
      
      // Listar todas as disponibilidades do médico
      console.log('\n📋 Todas as disponibilidades do médico:');
      medico.disponibilidades.forEach(disp => {
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        console.log(`   ${dias[disp.diaSemana]}: ${disp.horaInicio.toTimeString().slice(0,5)} - ${disp.horaFim.toTimeString().slice(0,5)}`);
      });
    }
    
    // Testar com uma data que deveria funcionar (segunda-feira às 10:00)
    console.log('\n🔍 Testando com data específica (Segunda às 10:00):');
    const dataSegunda = new Date('2025-01-27T10:00:00.000Z');
    const horaInicio = new Date(`1970-01-01T08:00:00.000Z`);
    const horaFim = new Date(`1970-01-01T18:00:00.000Z`);
    
    console.log(`Data teste: ${dataSegunda.toLocaleString('pt-BR')}`);
    console.log(`Hora início disponibilidade: ${horaInicio.toTimeString().slice(0,5)}`);
    console.log(`Hora fim disponibilidade: ${horaFim.toTimeString().slice(0,5)}`);
    
    const disponibilidadeSegunda = await prisma.disponibilidadeMedico.findFirst({
      where: {
        medicoId: medico.id,
        diaSemana: 1, // Segunda-feira
        horaInicio: { lte: dataSegunda },
        horaFim: { gt: dataSegunda },
      },
    });
    
    if (disponibilidadeSegunda) {
      console.log('✅ Disponibilidade para segunda-feira encontrada!');
    } else {
      console.log('❌ Problema na consulta de disponibilidade');
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDisponibilidade(); 