const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDisponibilidadeEduardo() {
  try {
    console.log('🔧 Adicionando disponibilidade ao Dr. Eduardo Amaro...');
    
    // Buscar o médico Eduardo Amaro
    const medico = await prisma.medico.findFirst({
      where: {
        nome: {
          contains: 'Eduardo Amaro',
          mode: 'insensitive'
        }
      }
    });
    
    if (!medico) {
      console.log('❌ Médico Eduardo Amaro não encontrado!');
      return;
    }
    
    console.log(`✅ Médico encontrado: ${medico.nome} (ID: ${medico.id})`);
    
    // Adicionar disponibilidade para segunda a sexta, das 8h às 18h
    const disponibilidades = [
      { diaSemana: 1, horaInicio: '08:00', horaFim: '18:00' }, // Segunda
      { diaSemana: 2, horaInicio: '08:00', horaFim: '18:00' }, // Terça
      { diaSemana: 3, horaInicio: '08:00', horaFim: '18:00' }, // Quarta
      { diaSemana: 4, horaInicio: '08:00', horaFim: '18:00' }, // Quinta
      { diaSemana: 5, horaInicio: '08:00', horaFim: '18:00' }, // Sexta
    ];
    
    for (const disp of disponibilidades) {
      const disponibilidade = await prisma.disponibilidadeMedico.create({
        data: {
          medicoId: medico.id,
          diaSemana: disp.diaSemana,
          horaInicio: new Date(`1970-01-01T${disp.horaInicio}:00`),
          horaFim: new Date(`1970-01-01T${disp.horaFim}:00`),
          disponivel: true,
        },
      });
      
      const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      console.log(`✅ Adicionada disponibilidade: ${dias[disp.diaSemana]} - ${disp.horaInicio} às ${disp.horaFim}`);
    }
    
    console.log('\n🎉 Disponibilidade adicionada com sucesso!');
    
    // Verificar se foi criada
    const disponibilidadesCriadas = await prisma.disponibilidadeMedico.findMany({
      where: { medicoId: medico.id },
      include: { medico: { select: { nome: true } } }
    });
    
    console.log(`\n📊 Total de disponibilidades para ${medico.nome}: ${disponibilidadesCriadas.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao adicionar disponibilidade:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDisponibilidadeEduardo(); 