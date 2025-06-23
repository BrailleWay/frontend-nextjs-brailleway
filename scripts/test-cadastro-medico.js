const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCadastroMedico() {
  try {
    console.log('🧪 Testando cadastro de médico...');
    
    // Teste 1: Verificar se existem especialidades
    const especialidades = await prisma.especialidade.findMany({
      where: { ativo: true }
    });
    
    console.log(`✅ Encontradas ${especialidades.length} especialidades:`);
    especialidades.forEach(esp => console.log(`   - ${esp.nome} (ID: ${esp.id})`));
    
    // Teste 2: Verificar se existem médicos cadastrados
    const medicos = await prisma.medico.findMany({
      include: {
        especialidade: true,
        disponibilidades: true
      }
    });
    
    console.log(`\n👨‍⚕️ Encontrados ${medicos.length} médicos cadastrados:`);
    medicos.forEach(medico => {
      console.log(`   - ${medico.nome} (CRM: ${medico.crm})`);
      console.log(`     Especialidade: ${medico.especialidade.nome}`);
      console.log(`     Disponibilidades: ${medico.disponibilidades.length} horários configurados`);
      
      if (medico.disponibilidades.length > 0) {
        medico.disponibilidades.forEach(disp => {
          const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
          const diaNome = dias[disp.diaSemana];
          console.log(`       ${diaNome}: ${disp.horaInicio.toTimeString().slice(0,5)} - ${disp.horaFim.toTimeString().slice(0,5)}`);
        });
      }
    });
    
    // Teste 3: Verificar estrutura da tabela de disponibilidade
    console.log('\n📊 Estrutura da tabela de disponibilidade:');
    const disponibilidades = await prisma.disponibilidadeMedico.findMany({
      take: 5,
      include: {
        medico: {
          select: { nome: true, crm: true }
        }
      }
    });
    
    disponibilidades.forEach(disp => {
      console.log(`   - Médico: ${disp.medico.nome} | Dia: ${disp.diaSemana} | Horário: ${disp.horaInicio.toTimeString().slice(0,5)} - ${disp.horaFim.toTimeString().slice(0,5)}`);
    });
    
    console.log('\n🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCadastroMedico(); 