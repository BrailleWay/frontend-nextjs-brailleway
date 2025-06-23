# 🎯 Melhorias no Agendamento por Especialidade - Brailinho

## 📋 Resumo das Implementações

### ✅ Funcionalidades Adicionadas

1. **Agendamento por Especialidade**: O Brailinho agora pode agendar consultas apenas mencionando a especialidade médica
2. **Seleção Inteligente de Médicos**: Sistema de scoring para escolher o melhor médico disponível
3. **Múltiplas Opções**: Quando há vários médicos disponíveis, o sistema apresenta opções para o usuário escolher
4. **Detecção Avançada de Escolha**: Reconhecimento de números, nomes e palavras-chave para seleção

---

## 🔧 Modificações Técnicas

### 1. **lib/actions.js** - Função `verificarDisponibilidade`

#### 🎯 Sistema de Scoring
```javascript
// Score baseado em 3 critérios:
// 1. Proximidade do horário desejado (0-100 pontos)
// 2. Flexibilidade de agenda (0-50 pontos)  
// 3. Menor ocupação (0-50 pontos)
```

#### 📊 Algoritmo de Seleção
- Verifica todos os médicos da especialidade
- Calcula score individual para cada médico disponível
- Ordena por score (maior primeiro)
- Se scores similares (< 20 pontos de diferença), oferece múltiplas opções

#### 🔍 Busca Melhorada
```javascript
// Antes: busca simples por nome
medicos = await prisma.medico.findMany({
  where: { especialidade: { contains: esp, mode: "insensitive" } }
});

// Agora: busca com include da especialidade
medicos = await prisma.medico.findMany({
  where: { 
    especialidade: { nome: { contains: esp, mode: "insensitive" } } 
  },
  include: { especialidade: true }
});
```

### 2. **components/RealtimeBrailinho.jsx** - Interface de Voz

#### 🎤 Detecção de Escolha Aprimorada
```javascript
// Reconhece múltiplas formas de escolha:
- Nome do médico: "Dr. João Silva"
- Número da opção: "1", "2", "3"
- Palavras-chave: "primeiro", "segundo", "terceiro"
- Números por extenso: "um", "dois", "três"
```

#### 💬 Mensagens Estruturadas
```javascript
// Para múltiplas opções:
"Encontrei 3 médicos disponíveis. As opções são: 1 - Dr. João Silva, 2 - Dra. Maria Santos, 3 - Dr. Pedro Costa. Por favor, escolha um médico dizendo o nome ou o número da opção."
```

#### 🤖 System Prompt Atualizado
- Instruções claras sobre agendamento por especialidade
- Exemplos de uso prático
- Orientações para confirmações

---

## 🧪 Testes e Validação

### Script de Teste: `scripts/test-especialidade.js`
```bash
node scripts/test-especialidade.js
```

**Resultados do Teste:**
- ✅ Busca por especialidade funcionando
- ✅ Sistema de scoring operacional
- ✅ Detecção de disponibilidade correta
- ✅ Verificação de conflitos implementada

---

## 🎯 Exemplos de Uso

### 1. **Agendamento Simples por Especialidade**
```
Usuário: "Quero agendar com psicólogo amanhã às 14h"
Brailinho: "Encontrei 2 psicólogos disponíveis. As opções são: 1 - Dr. Eduardo Amaro, 2 - Dr. Marcus Silva. Por favor, escolha um médico dizendo o nome ou o número da opção."
```

### 2. **Agendamento Direto (Melhor Opção)**
```
Usuário: "Preciso de cardiologista na sexta às 10h"
Brailinho: "Horário encontrado com Dr. Carlos Cardio (Cardiologia) em 28/06/2025 às 10:00. Posso confirmar o agendamento?"
```

### 3. **Confirmação de Nome**
```
Usuário: "Dr. João Silva, amanhã às 15h"
Brailinho: "Você quis dizer Dr. João Silva? Por favor, responda sim ou não."
```

---

## 📊 Critérios de Scoring

### 🎯 Proximidade do Horário (0-100 pontos)
- Calcula distância do horário desejado até o meio do período de atendimento
- Quanto mais próximo do meio, melhor o score

### 📅 Flexibilidade (0-50 pontos)
- Conta total de disponibilidades do médico
- Médicos com mais horários disponíveis recebem pontos extras

### ⏰ Ocupação (0-50 pontos)
- Conta consultas agendadas futuras
- Médicos menos ocupados recebem pontos extras

---

## 🔄 Fluxo de Funcionamento

1. **Entrada do Usuário**: Menciona especialidade + data/hora
2. **Busca de Médicos**: Sistema encontra todos os médicos da especialidade
3. **Verificação de Disponibilidade**: Para cada médico, verifica:
   - Horário de atendimento
   - Bloqueios manuais
   - Conflitos com outras consultas
4. **Cálculo de Score**: Aplica algoritmo de scoring
5. **Seleção/Opções**:
   - Se apenas 1 médico disponível: seleciona automaticamente
   - Se múltiplos com scores similares: apresenta opções
   - Se 1 claramente melhor: seleciona automaticamente
6. **Confirmação**: Aguarda confirmação do usuário
7. **Agendamento**: Executa o agendamento

---

## 🚀 Benefícios

### Para o Usuário
- ✅ Agendamento mais rápido e intuitivo
- ✅ Não precisa conhecer nomes específicos de médicos
- ✅ Escolha automática do melhor médico disponível
- ✅ Opções claras quando há múltiplas possibilidades

### Para o Sistema
- ✅ Melhor distribuição de consultas
- ✅ Otimização da agenda médica
- ✅ Redução de conflitos de horário
- ✅ Experiência mais fluida

---

## 🔧 Configurações

### Timezone
```javascript
const TZ = "America/Sao_Paulo";
```

### Thresholds
```javascript
// Score mínimo para confirmação automática
const SCORE_THRESHOLD = 0.7;

// Diferença máxima para considerar scores similares
const SCORE_SIMILARITY_THRESHOLD = 20;

// Máximo de opções apresentadas
const MAX_OPTIONS = 3;
```

---

## 📝 Próximos Passos

1. **Testes em Produção**: Validar com usuários reais
2. **Ajustes de Score**: Refinar critérios baseado no uso
3. **Métricas**: Implementar tracking de escolhas dos usuários
4. **Machine Learning**: Considerar histórico de preferências

---

## 🐛 Troubleshooting

### Problema: Médico não encontrado
**Solução**: Verificar se a especialidade está cadastrada corretamente no banco

### Problema: Horário não disponível
**Solução**: Verificar disponibilidades do médico e conflitos de agenda

### Problema: Detecção de voz incorreta
**Solução**: Verificar logs de reconhecimento e ajustar padrões de regex 