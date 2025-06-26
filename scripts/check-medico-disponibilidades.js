const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMedicoDisponibilidades() {
  console.log('🔍 Verificando disponibilidades dos médicos...\n');

  try {
    // Buscar todos os médicos ativos
    const medicos = await prisma.medico.findMany({
      where: { ativo: true },
      include: {
        especialidade: true,
        disponibilidades: true
      }
    });

    console.log(`📋 Total de médicos ativos: ${medicos.length}\n`);

    const medicosSemDisponibilidade = [];
    const medicosComDisponibilidade = [];

    for (const medico of medicos) {
      if (medico.disponibilidades.length === 0) {
        medicosSemDisponibilidade.push(medico);
      } else {
        medicosComDisponibilidade.push(medico);
      }
    }

    // Médicos sem disponibilidade
    if (medicosSemDisponibilidade.length > 0) {
      console.log('❌ Médicos SEM disponibilidade configurada:');
      medicosSemDisponibilidade.forEach(m => {
        console.log(`   - ${m.nome} (${m.especialidade.nome}) - CRM: ${m.crm}`);
      });
      console.log('');
    }

    // Médicos com disponibilidade
    if (medicosComDisponibilidade.length > 0) {
      console.log('✅ Médicos COM disponibilidade configurada:');
      medicosComDisponibilidade.forEach(m => {
        console.log(`   - ${m.nome} (${m.especialidade.nome}) - CRM: ${m.crm}`);
        console.log(`     Disponibilidades: ${m.disponibilidades.length} horários`);
        
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        m.disponibilidades.forEach(d => {
          console.log(`       ${dias[d.diaSemana]}: ${d.horaInicio.toTimeString().slice(0,5)} - ${d.horaFim.toTimeString().slice(0,5)}`);
        });
        console.log('');
      });
    }

    // Estatísticas
    console.log('📊 Estatísticas:');
    console.log(`   - Total de médicos: ${medicos.length}`);
    console.log(`   - Com disponibilidade: ${medicosComDisponibilidade.length}`);
    console.log(`   - Sem disponibilidade: ${medicosSemDisponibilidade.length}`);
    console.log(`   - Taxa de configuração: ${((medicosComDisponibilidade.length / medicos.length) * 100).toFixed(1)}%`);

    // Sugestões
    if (medicosSemDisponibilidade.length > 0) {
      console.log('\n💡 Sugestões:');
      console.log('   - Entre em contato com os médicos sem disponibilidade para configurar seus horários');
      console.log('   - Considere criar um processo automatizado de configuração de disponibilidade');
      console.log('   - Implemente notificações para médicos recém-cadastrados');
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMedicoDisponibilidades(); 