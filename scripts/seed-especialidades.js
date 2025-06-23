const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const especialidades = [
  {
    id: 1,
    nome: 'Psicologia',
    descricao: 'Especialidade médica que trata de distúrbios mentais e comportamentais',
    areaAtuacao: 'Saúde Mental',
    conselhoProfissional: 'CRP',
    ativo: true
  },
  {
    id: 2,
    nome: 'Psiquiatria',
    descricao: 'Especialidade médica que diagnostica e trata transtornos mentais',
    areaAtuacao: 'Saúde Mental',
    conselhoProfissional: 'CRM',
    ativo: true
  },
  {
    id: 3,
    nome: 'Neurologia',
    descricao: 'Especialidade médica que trata doenças do sistema nervoso',
    areaAtuacao: 'Neurologia',
    conselhoProfissional: 'CRM',
    ativo: true
  },
  {
    id: 4,
    nome: 'Cardiologia',
    descricao: 'Especialidade médica que trata doenças do coração',
    areaAtuacao: 'Cardiologia',
    conselhoProfissional: 'CRM',
    ativo: true
  },
  {
    id: 5,
    nome: 'Ortopedia',
    descricao: 'Especialidade médica que trata doenças do sistema locomotor',
    areaAtuacao: 'Ortopedia',
    conselhoProfissional: 'CRM',
    ativo: true
  },
  {
    id: 6,
    nome: 'Dermatologia',
    descricao: 'Especialidade médica que trata doenças da pele',
    areaAtuacao: 'Dermatologia',
    conselhoProfissional: 'CRM',
    ativo: true
  },
  {
    id: 7,
    nome: 'Ginecologia',
    descricao: 'Especialidade médica que trata saúde da mulher',
    areaAtuacao: 'Ginecologia',
    conselhoProfissional: 'CRM',
    ativo: true
  },
  {
    id: 8,
    nome: 'Pediatria',
    descricao: 'Especialidade médica que trata saúde de crianças e adolescentes',
    areaAtuacao: 'Pediatria',
    conselhoProfissional: 'CRM',
    ativo: true
  }
];

async function seedEspecialidades() {
  try {
    console.log('🌱 Iniciando seed de especialidades...');
    
    for (const especialidade of especialidades) {
      await prisma.especialidade.upsert({
        where: { id: especialidade.id },
        update: especialidade,
        create: especialidade,
      });
      console.log(`✅ Especialidade "${especialidade.nome}" criada/atualizada`);
    }
    
    console.log('🎉 Seed de especialidades concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEspecialidades(); 