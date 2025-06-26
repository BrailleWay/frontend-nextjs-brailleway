// =============================
// scripts/fix-medico-disponibilidades.js
// Script para adicionar disponibilidades padrão para médicos sem configuração
// =============================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixMedicoDisponibilidades() {
  console.log('🔧 Corrigindo disponibilidades dos médicos...\n');

  try {
    // Buscar médicos sem disponibilidade
    const medicosSemDisponibilidade = await prisma.medico.findMany({
      where: { 
        ativo: true,
        disponibilidades: {
          none: {}
        }
      },
      include: {
        especialidade: true
      }
    });

    console.log(`📋 Encontrados ${medicosSemDisponibilidade.length} médicos sem disponibilidade:\n`);

    if (medicosSemDisponibilidade.length === 0) {
      console.log('✅ Todos os médicos já têm disponibilidade configurada!');
      return;
    }

    // Mostrar médicos que serão corrigidos
    medicosSemDisponibilidade.forEach(m => {
      console.log(`   - ${m.nome} (${m.especialidade.nome}) - CRM: ${m.crm}`);
    });

    console.log('\n⏰ Adicionando disponibilidade padrão (Segunda a Sexta, 8h às 18h)...\n');

    // Disponibilidade padrão: Segunda a Sexta, 8h às 18h
    const disponibilidadesPadrao = [
      { diaSemana: 1, horaInicio: '08:00', horaFim: '18:00' }, // Segunda
      { diaSemana: 2, horaInicio: '08:00', horaFim: '18:00' }, // Terça
      { diaSemana: 3, horaInicio: '08:00', horaFim: '18:00' }, // Quarta
      { diaSemana: 4, horaInicio: '08:00', horaFim: '18:00' }, // Quinta
      { diaSemana: 5, horaInicio: '08:00', horaFim: '18:00' }, // Sexta
    ];

    let medicosCorrigidos = 0;

    for (const medico of medicosSemDisponibilidade) {
      console.log(`🔧 Configurando ${medico.nome}...`);
      
      try {
        for (const disp of disponibilidadesPadrao) {
          await prisma.disponibilidadeMedico.create({
            data: {
              medicoId: medico.id,
              diaSemana: disp.diaSemana,
              horaInicio: new Date(`1970-01-01T${disp.horaInicio}:00`),
              horaFim: new Date(`1970-01-01T${disp.horaFim}:00`),
              disponivel: true,
            },
          });
        }
        
        medicosCorrigidos++;
        console.log(`   ✅ ${medico.nome} configurado com sucesso`);
      } catch (error) {
        console.error(`   ❌ Erro ao configurar ${medico.nome}:`, error.message);
      }
    }

    console.log(`\n🎉 Processo concluído!`);
    console.log(`   - Médicos corrigidos: ${medicosCorrigidos}/${medicosSemDisponibilidade.length}`);
    
    if (medicosCorrigidos < medicosSemDisponibilidade.length) {
      console.log(`   - ${medicosSemDisponibilidade.length - medicosCorrigidos} médicos com erro`);
    }

    // Verificar resultado final
    console.log('\n📊 Verificação final:');
    const medicosAindaSemDisponibilidade = await prisma.medico.findMany({
      where: { 
        ativo: true,
        disponibilidades: {
          none: {}
        }
      },
      include: {
        especialidade: true
      }
    });

    if (medicosAindaSemDisponibilidade.length === 0) {
      console.log('✅ Todos os médicos agora têm disponibilidade configurada!');
    } else {
      console.log(`⚠️  Ainda há ${medicosAindaSemDisponibilidade.length} médicos sem disponibilidade:`);
      medicosAindaSemDisponibilidade.forEach(m => {
        console.log(`   - ${m.nome} (${m.especialidade.nome})`);
      });
    }

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Perguntar se o usuário quer executar
console.log('⚠️  ATENÇÃO: Este script irá adicionar disponibilidade padrão para médicos sem configuração.');
console.log('   Disponibilidade padrão: Segunda a Sexta, 8h às 18h');
console.log('   Deseja continuar? (y/N)');

// Para execução automática, descomente a linha abaixo:
// fixMedicoDisponibilidades();

// Para execução interativa, mantenha comentado e execute manualmente
console.log('\n💡 Para executar, descomente a linha "fixMedicoDisponibilidades();" no final do arquivo'); 