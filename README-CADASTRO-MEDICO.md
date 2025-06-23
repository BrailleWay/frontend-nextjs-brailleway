# Cadastro de Médico - BrailleWay

## 📋 Visão Geral

O sistema de cadastro de médico foi implementado com funcionalidades completas para permitir que médicos se registrem na plataforma BrailleWay, incluindo a configuração de seus horários de disponibilidade para atendimento.

## ✨ Funcionalidades Implementadas

### 1. **Formulário de Cadastro Completo**
- ✅ Informações pessoais (nome, CRM, email, telefone)
- ✅ Seleção de especialidade médica
- ✅ Criação de senha segura
- ✅ Validações de formulário

### 2. **Configuração de Disponibilidade**
- ✅ Seleção de dias da semana (Domingo a Sábado)
- ✅ Definição de horários de início e fim para cada dia
- ✅ Interface intuitiva com checkboxes e campos de tempo
- ✅ Validação de horários (fim > início)

### 3. **Validações e Segurança**
- ✅ Validação de senhas (mínimo 6 caracteres)
- ✅ Confirmação de senha
- ✅ Validação de CRM (mínimo 5 caracteres)
- ✅ Formatação automática de telefone
- ✅ Verificação de pelo menos um dia de disponibilidade
- ✅ Criptografia de senha com bcrypt

### 4. **Integração com Banco de Dados**
- ✅ Criação do registro do médico
- ✅ Inserção automática das disponibilidades
- ✅ Relacionamento com especialidades
- ✅ Tratamento de erros (email/CRM duplicados)

## 🗂️ Estrutura dos Arquivos

```
├── app/cadastro/medico/
│   └── page.js                    # Página principal do cadastro
├── components/forms/
│   └── RegistroMedico.js          # Componente do formulário
├── lib/
│   ├── actions.js                 # Funções server actions
│   └── prisma.js                  # Configuração do Prisma
├── prisma/
│   └── schema.prisma              # Schema do banco de dados
└── scripts/
    ├── seed-especialidades.js     # Script para inserir especialidades
    └── test-cadastro-medico.js    # Script de teste
```

## 🚀 Como Usar

### 1. **Acessar o Cadastro**
- Navegue para `/cadastro/medico`
- O formulário será carregado automaticamente

### 2. **Preencher Informações Pessoais**
- **Nome Completo**: Nome completo do médico
- **CRM**: Número do CRM (mínimo 5 caracteres)
- **Email**: Email válido e único
- **Telefone**: Formato (XX) XXXXX-XXXX (opcional)
- **Especialidade**: Selecionar da lista de especialidades disponíveis
- **Senha**: Mínimo 6 caracteres
- **Confirmar Senha**: Deve ser igual à senha

### 3. **Configurar Disponibilidade**
- Marque os dias da semana em que você atende
- Para cada dia marcado, defina:
  - **Horário de Início**: Ex: 08:00
  - **Horário de Fim**: Ex: 18:00
- Pelo menos um dia deve ser selecionado

### 4. **Finalizar Cadastro**
- Clique em "Cadastrar"
- Aguarde a confirmação de sucesso
- O formulário será limpo automaticamente

## 🗄️ Banco de Dados

### Tabelas Utilizadas

#### `Medico`
```sql
- id (PK)
- nome
- senha (criptografada)
- crm (único)
- email (único)
- telefone
- especialidadeId (FK)
- ativo
- criadoEm
- atualizadoEm
```

#### `DisponibilidadeMedico`
```sql
- id (PK)
- medicoId (FK)
- diaSemana (0-6, onde 0=Domingo)
- horaInicio (TIME)
- horaFim (TIME)
- disponivel (BOOLEAN)
- criadoEm
```

#### `Especialidade`
```sql
- id (PK)
- nome
- descricao
- areaAtuacao
- conselhoProfissional
- ativo
```

## 🔧 Scripts Disponíveis

### Inserir Especialidades
```bash
node scripts/seed-especialidades.js
```

### Testar Sistema
```bash
node scripts/test-cadastro-medico.js
```

## 🎯 Especialidades Disponíveis

O sistema inclui as seguintes especialidades pré-cadastradas:

1. **Psicologia** - Saúde Mental (CRP)
2. **Psiquiatria** - Saúde Mental (CRM)
3. **Neurologia** - Neurologia (CRM)
4. **Cardiologia** - Cardiologia (CRM)
5. **Ortopedia** - Ortopedia (CRM)
6. **Dermatologia** - Dermatologia (CRM)
7. **Ginecologia** - Ginecologia (CRM)
8. **Pediatria** - Pediatria (CRM)

## 🔒 Segurança

- **Senhas**: Criptografadas com bcrypt (12 rounds)
- **Validações**: Frontend e backend
- **Tratamento de Erros**: Mensagens amigáveis
- **Prevenção de Duplicatas**: Email e CRM únicos

## 🐛 Tratamento de Erros

O sistema trata os seguintes erros:

- **Email já em uso**: "Email já está em uso."
- **CRM já em uso**: "CRM já está em uso."
- **Senhas não coincidem**: "As senhas não coincidem."
- **Dados inválidos**: Validações específicas por campo
- **Erro interno**: "Erro ao cadastrar médico."

## 📱 Responsividade

O formulário é totalmente responsivo:
- **Desktop**: Layout em duas colunas
- **Mobile**: Layout em uma coluna
- **Tablet**: Layout adaptativo

## 🔄 Fluxo de Dados

1. **Frontend** → Validações básicas
2. **Server Action** → Validações avançadas
3. **Prisma** → Inserção no banco
4. **Resposta** → Sucesso/Erro para o usuário

## 🎨 Interface

- **Design**: Moderno e limpo
- **Cores**: Consistente com o tema BrailleWay
- **Feedback**: Mensagens de sucesso/erro claras
- **Loading**: Indicador durante o cadastro
- **Hover**: Efeitos visuais nos elementos interativos

## 📈 Próximos Passos

- [ ] Dashboard do médico para gerenciar disponibilidades
- [ ] Edição de perfil
- [ ] Upload de documentos
- [ ] Notificações de consultas
- [ ] Integração com sistema de pagamentos

---

**Desenvolvido para BrailleWay** 🚀 