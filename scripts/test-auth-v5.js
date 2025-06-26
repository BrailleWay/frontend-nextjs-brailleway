// =============================
// scripts/test-auth-v5.js
// Teste da autenticação simplificada do Auth.js v5
// =============================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuthV5() {
  console.log("🔐 Testando autenticação Auth.js v5...\n");

  try {
    // 1. Verificar usuários existentes
    console.log("📋 Usuários cadastrados:");
    
    const pacientes = await prisma.paciente.findMany({
      where: { ativo: true },
      select: { id: true, nome: true, email: true, ativo: true }
    });
    
    const medicos = await prisma.medico.findMany({
      where: { ativo: true },
      select: { id: true, nome: true, email: true, ativo: true }
    });

    console.log(`\n👥 Pacientes (${pacientes.length}):`);
    pacientes.forEach(p => {
      console.log(`   - ${p.nome} (${p.email}) - ID: ${p.id}`);
    });

    console.log(`\n👨‍⚕️ Médicos (${medicos.length}):`);
    medicos.forEach(m => {
      console.log(`   - ${m.nome} (${m.email}) - ID: ${m.id}`);
    });

    // 2. Testar hash de senha
    console.log("\n🔑 Testando hash de senha:");
    const testPassword = "123456";
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log(`   Senha original: ${testPassword}`);
    console.log(`   Hash gerado: ${hashedPassword.substring(0, 20)}...`);
    
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log(`   Validação: ${isValid ? '✅ Válido' : '❌ Inválido'}`);

    // 3. Simular processo de autenticação
    console.log("\n🔍 Simulando processo de autenticação:");
    
    if (pacientes.length > 0) {
      const paciente = pacientes[0];
      console.log(`\n   Testando login como paciente: ${paciente.email}`);
      
      // Buscar paciente com senha
      const pacienteComSenha = await prisma.paciente.findUnique({
        where: { email: paciente.email },
        select: { id: true, nome: true, email: true, senha: true, ativo: true }
      });
      
      if (pacienteComSenha) {
        console.log(`   ✅ Paciente encontrado: ${pacienteComSenha.nome}`);
        console.log(`   ✅ Status ativo: ${pacienteComSenha.ativo}`);
        console.log(`   ✅ Senha hashada: ${pacienteComSenha.senha.substring(0, 20)}...`);
        
        // Simular verificação de senha
        const senhaTeste = "123456"; // Senha comum para teste
        const senhaValida = await bcrypt.compare(senhaTeste, pacienteComSenha.senha);
        console.log(`   🔐 Teste senha "${senhaTeste}": ${senhaValida ? '✅ Válida' : '❌ Inválida'}`);
      }
    }

    if (medicos.length > 0) {
      const medico = medicos[0];
      console.log(`\n   Testando login como médico: ${medico.email}`);
      
      // Buscar médico com senha
      const medicoComSenha = await prisma.medico.findUnique({
        where: { email: medico.email },
        select: { id: true, nome: true, email: true, senha: true, ativo: true }
      });
      
      if (medicoComSenha) {
        console.log(`   ✅ Médico encontrado: ${medicoComSenha.nome}`);
        console.log(`   ✅ Status ativo: ${medicoComSenha.ativo}`);
        console.log(`   ✅ Senha hashada: ${medicoComSenha.senha.substring(0, 20)}...`);
        
        // Simular verificação de senha
        const senhaTeste = "123456"; // Senha comum para teste
        const senhaValida = await bcrypt.compare(senhaTeste, medicoComSenha.senha);
        console.log(`   🔐 Teste senha "${senhaTeste}": ${senhaValida ? '✅ Válida' : '❌ Inválida'}`);
      }
    }

    // 4. Verificar estrutura do banco
    console.log("\n🗄️ Verificando estrutura do banco:");
    
    const totalPacientes = await prisma.paciente.count();
    const totalMedicos = await prisma.medico.count();
    const pacientesAtivos = await prisma.paciente.count({ where: { ativo: true } });
    const medicosAtivos = await prisma.medico.count({ where: { ativo: true } });
    
    console.log(`   Total de pacientes: ${totalPacientes} (${pacientesAtivos} ativos)`);
    console.log(`   Total de médicos: ${totalMedicos} (${medicosAtivos} ativos)`);

    // 5. Sugestões
    console.log("\n💡 Sugestões:");
    console.log("   - Verifique se as senhas dos usuários estão corretas");
    console.log("   - Teste o login com credenciais reais no frontend");
    console.log("   - Monitore os logs do Auth.js v5 durante o login");
    console.log("   - Verifique se o middleware está funcionando corretamente");

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthV5(); 