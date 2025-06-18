-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('M', 'F', 'Outro', 'Prefiro não informar');

-- CreateEnum
CREATE TYPE "TipoCartao" AS ENUM ('Crédito', 'Débito');

-- CreateEnum
CREATE TYPE "PacientePlanoStatus" AS ENUM ('ativo', 'cancelado', 'expirado');

-- CreateEnum
CREATE TYPE "TipoConta" AS ENUM ('Corrente', 'Poupança');

-- CreateEnum
CREATE TYPE "FormatoArquivo" AS ENUM ('mp3', 'wav', 'ogg');

-- CreateEnum
CREATE TYPE "NivelDificuldade" AS ENUM ('Iniciante', 'Intermediário', 'Avançado');

-- CreateEnum
CREATE TYPE "ConsultaStatus" AS ENUM ('agendada', 'em_andamento', 'concluida', 'cancelada');

-- CreateEnum
CREATE TYPE "TipoArquivoLaudo" AS ENUM ('pdf', 'docx', 'odt');

-- CreateEnum
CREATE TYPE "SalaChatStatus" AS ENUM ('ativa', 'arquivada');

-- CreateEnum
CREATE TYPE "RemetenteTipo" AS ENUM ('paciente', 'medico');

-- CreateEnum
CREATE TYPE "TipoMensagem" AS ENUM ('texto', 'imagem', 'arquivo', 'audio');

-- CreateEnum
CREATE TYPE "FaturaStatus" AS ENUM ('pendente', 'paga', 'falhou', 'reembolsada');

-- CreateTable
CREATE TABLE "PerfilAcesso" (
    "perfil_id" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,

    CONSTRAINT "PerfilAcesso_pkey" PRIMARY KEY ("perfil_id")
);

-- CreateTable
CREATE TABLE "nivelAcessoPlano" (
    "nivelAcessoPlano_id" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "nivelAcessoPlano_pkey" PRIMARY KEY ("nivelAcessoPlano_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "perfil_id" INTEGER DEFAULT 1,
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "paciente_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(255) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "genero" "Genero" NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "perfil_id" INTEGER DEFAULT 2,
    "descricao" TEXT,
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("paciente_id")
);

-- CreateTable
CREATE TABLE "CartaoPaciente" (
    "cartaoPaciente_id" SERIAL NOT NULL,
    "operadora" VARCHAR(255) NOT NULL,
    "nome_titular" VARCHAR(255) NOT NULL,
    "numero_cartao_criptografado" TEXT NOT NULL,
    "validade_mes" INTEGER NOT NULL,
    "validade_ano" INTEGER NOT NULL,
    "tipo_cartao" "TipoCartao" NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartaoPaciente_pkey" PRIMARY KEY ("cartaoPaciente_id")
);

-- CreateTable
CREATE TABLE "planoAssinatura" (
    "planoAssinatura_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "nivelAcessoPlano_id" INTEGER NOT NULL,
    "duracao_consulta_minutos" INTEGER NOT NULL DEFAULT 30,
    "limite_consultas" INTEGER NOT NULL,
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planoAssinatura_pkey" PRIMARY KEY ("planoAssinatura_id")
);

-- CreateTable
CREATE TABLE "pacientePlano" (
    "pacientePlano_id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "planoAssinatura_id" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP,
    "consultas_utilizadas" INTEGER DEFAULT 0,
    "status" "PacientePlanoStatus" DEFAULT 'ativo',

    CONSTRAINT "pacientePlano_pkey" PRIMARY KEY ("pacientePlano_id")
);

-- CreateTable
CREATE TABLE "Especialidade" (
    "especialidade_id" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "area_atuacao" VARCHAR(255),
    "conselho_profissional" VARCHAR(255),
    "ativo" BOOLEAN DEFAULT true,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("especialidade_id")
);

-- CreateTable
CREATE TABLE "Medico" (
    "medico_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "crm" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(255) NOT NULL,
    "especialidade_id" INTEGER NOT NULL,
    "perfil_id" INTEGER DEFAULT 3,
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("medico_id")
);

-- CreateTable
CREATE TABLE "dadosBancariosMedico" (
    "dadosBancariosMedico_id" SERIAL NOT NULL,
    "medico_id" INTEGER NOT NULL,
    "tipo_conta" "TipoConta" NOT NULL,
    "banco" VARCHAR(100) NOT NULL,
    "agencia" VARCHAR(10) NOT NULL,
    "conta" VARCHAR(20) NOT NULL,
    "digito_conta" VARCHAR(2),
    "pix" VARCHAR(255),
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dadosBancariosMedico_pkey" PRIMARY KEY ("dadosBancariosMedico_id")
);

-- CreateTable
CREATE TABLE "disponibilidadeMedico" (
    "disponibilidade_id" SERIAL NOT NULL,
    "medico_id" INTEGER NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fim" TIME NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disponibilidadeMedico_pkey" PRIMARY KEY ("disponibilidade_id")
);

-- CreateTable
CREATE TABLE "BloqueioAgenda" (
    "bloqueio_id" SERIAL NOT NULL,
    "medico_id" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP NOT NULL,
    "data_fim" TIMESTAMP NOT NULL,
    "motivo" TEXT,
    "criado_em" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloqueioAgenda_pkey" PRIMARY KEY ("bloqueio_id")
);

-- CreateTable
CREATE TABLE "Fatura" (
    "fatura_id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "paciente_plano_id" INTEGER,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" "FaturaStatus" NOT NULL DEFAULT 'pendente',
    "data_vencimento" DATE NOT NULL,
    "data_pagamento" TIMESTAMP,
    "gateway_transacao_id" TEXT,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("fatura_id")
);

-- CreateTable
CREATE TABLE "FrequenciaSonora" (
    "frequenciaSonora_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "hz" DECIMAL(10,2) NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "formato_arquivo" "FormatoArquivo" NOT NULL,
    "duracao_segundos" INTEGER,
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FrequenciaSonora_pkey" PRIMARY KEY ("frequenciaSonora_id")
);

-- CreateTable
CREATE TABLE "Meditacao" (
    "meditacao_id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "frequenciaSonora_id" INTEGER NOT NULL,
    "nivel_dificuldade" "NivelDificuldade",
    "ativo" BOOLEAN DEFAULT true,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meditacao_pkey" PRIMARY KEY ("meditacao_id")
);

-- CreateTable
CREATE TABLE "sessaoMeditacao" (
    "sessaoMeditacao_id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "meditacao_id" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP,
    "duracao_real_minutos" INTEGER,
    "concluida" BOOLEAN DEFAULT false,

    CONSTRAINT "sessaoMeditacao_pkey" PRIMARY KEY ("sessaoMeditacao_id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "consulta_id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "medico_id" INTEGER NOT NULL,
    "data_hora" TIMESTAMP NOT NULL,
    "duracao_minutos" INTEGER DEFAULT 30,
    "resumo" TEXT,
    "status" "ConsultaStatus" DEFAULT 'agendada',
    "observacoes" TEXT,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("consulta_id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "avaliacao_id" SERIAL NOT NULL,
    "consulta_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("avaliacao_id")
);

-- CreateTable
CREATE TABLE "Laudo" (
    "laudo_id" SERIAL NOT NULL,
    "consulta_id" INTEGER NOT NULL,
    "nome_arquivo" VARCHAR(255) NOT NULL,
    "tipo_arquivo" "TipoArquivoLaudo" NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "tamanho_bytes" BIGINT,
    "data_upload" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "data_emissao" TIMESTAMP NOT NULL,
    "medico_responsavel" INTEGER NOT NULL,

    CONSTRAINT "Laudo_pkey" PRIMARY KEY ("laudo_id")
);

-- CreateTable
CREATE TABLE "videoChamada" (
    "videoChamada_id" SERIAL NOT NULL,
    "consulta_id" INTEGER NOT NULL,
    "url_externa" TEXT NOT NULL,
    "plataforma" VARCHAR(100) NOT NULL,
    "sala_id" VARCHAR(255),
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "iniciado_em" TIMESTAMP,
    "encerrado_em" TIMESTAMP,

    CONSTRAINT "videoChamada_pkey" PRIMARY KEY ("videoChamada_id")
);

-- CreateTable
CREATE TABLE "salaChat" (
    "sala_id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "medico_id" INTEGER NOT NULL,
    "consulta_id" INTEGER,
    "status" "SalaChatStatus" DEFAULT 'ativa',
    "criado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salaChat_pkey" PRIMARY KEY ("sala_id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "mensagem_id" SERIAL NOT NULL,
    "sala_id" INTEGER NOT NULL,
    "remetente_tipo" "RemetenteTipo" NOT NULL,
    "remetente_id" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo_mensagem" "TipoMensagem" NOT NULL DEFAULT 'texto',
    "arquivo_caminho" TEXT,
    "lida" BOOLEAN DEFAULT false,
    "enviado_em" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("mensagem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PerfilAcesso_nome_key" ON "PerfilAcesso"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "nivelAcessoPlano_nome_key" ON "nivelAcessoPlano"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pacientePlano_paciente_id_planoAssinatura_id_key" ON "pacientePlano"("paciente_id", "planoAssinatura_id");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidade_nome_key" ON "Especialidade"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_crm_key" ON "Medico"("crm");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_email_key" ON "Medico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dadosBancariosMedico_medico_id_tipo_conta_agencia_conta_key" ON "dadosBancariosMedico"("medico_id", "tipo_conta", "agencia", "conta");

-- CreateIndex
CREATE INDEX "idx_disponibilidade_medico" ON "disponibilidadeMedico"("medico_id", "dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidadeMedico_medico_id_dia_semana_hora_inicio_hora_key" ON "disponibilidadeMedico"("medico_id", "dia_semana", "hora_inicio", "hora_fim");

-- CreateIndex
CREATE INDEX "BloqueioAgenda_medico_id_data_inicio_data_fim_idx" ON "BloqueioAgenda"("medico_id", "data_inicio", "data_fim");

-- CreateIndex
CREATE UNIQUE INDEX "Fatura_gateway_transacao_id_key" ON "Fatura"("gateway_transacao_id");

-- CreateIndex
CREATE INDEX "Fatura_paciente_id_idx" ON "Fatura"("paciente_id");

-- CreateIndex
CREATE INDEX "Fatura_status_idx" ON "Fatura"("status");

-- CreateIndex
CREATE INDEX "idx_sessao_meditacao_paciente" ON "sessaoMeditacao"("paciente_id");

-- CreateIndex
CREATE INDEX "idx_consulta_data" ON "Consulta"("data_hora");

-- CreateIndex
CREATE INDEX "idx_consulta_paciente" ON "Consulta"("paciente_id");

-- CreateIndex
CREATE INDEX "idx_consulta_medico" ON "Consulta"("medico_id");

-- CreateIndex
CREATE INDEX "idx_consulta_status" ON "Consulta"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_consulta_id_key" ON "Avaliacao"("consulta_id");

-- CreateIndex
CREATE UNIQUE INDEX "videoChamada_consulta_id_key" ON "videoChamada"("consulta_id");

-- CreateIndex
CREATE UNIQUE INDEX "salaChat_paciente_id_medico_id_key" ON "salaChat"("paciente_id", "medico_id");

-- CreateIndex
CREATE INDEX "idx_mensagem_sala" ON "Mensagem"("sala_id");

-- CreateIndex
CREATE INDEX "idx_mensagem_enviado" ON "Mensagem"("enviado_em");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "PerfilAcesso"("perfil_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "PerfilAcesso"("perfil_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartaoPaciente" ADD CONSTRAINT "CartaoPaciente_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planoAssinatura" ADD CONSTRAINT "planoAssinatura_nivelAcessoPlano_id_fkey" FOREIGN KEY ("nivelAcessoPlano_id") REFERENCES "nivelAcessoPlano"("nivelAcessoPlano_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientePlano" ADD CONSTRAINT "pacientePlano_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientePlano" ADD CONSTRAINT "pacientePlano_planoAssinatura_id_fkey" FOREIGN KEY ("planoAssinatura_id") REFERENCES "planoAssinatura"("planoAssinatura_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_especialidade_id_fkey" FOREIGN KEY ("especialidade_id") REFERENCES "Especialidade"("especialidade_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "PerfilAcesso"("perfil_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dadosBancariosMedico" ADD CONSTRAINT "dadosBancariosMedico_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico"("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilidadeMedico" ADD CONSTRAINT "disponibilidadeMedico_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico"("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueioAgenda" ADD CONSTRAINT "BloqueioAgenda_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico"("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_paciente_plano_id_fkey" FOREIGN KEY ("paciente_plano_id") REFERENCES "pacientePlano"("pacientePlano_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meditacao" ADD CONSTRAINT "Meditacao_frequenciaSonora_id_fkey" FOREIGN KEY ("frequenciaSonora_id") REFERENCES "FrequenciaSonora"("frequenciaSonora_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessaoMeditacao" ADD CONSTRAINT "sessaoMeditacao_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessaoMeditacao" ADD CONSTRAINT "sessaoMeditacao_meditacao_id_fkey" FOREIGN KEY ("meditacao_id") REFERENCES "Meditacao"("meditacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico"("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consulta"("consulta_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laudo" ADD CONSTRAINT "Laudo_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consulta"("consulta_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laudo" ADD CONSTRAINT "Laudo_medico_responsavel_fkey" FOREIGN KEY ("medico_responsavel") REFERENCES "Medico"("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoChamada" ADD CONSTRAINT "videoChamada_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consulta"("consulta_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaChat" ADD CONSTRAINT "salaChat_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("paciente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaChat" ADD CONSTRAINT "salaChat_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "Medico"("medico_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaChat" ADD CONSTRAINT "salaChat_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "Consulta"("consulta_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salaChat"("sala_id") ON DELETE RESTRICT ON UPDATE CASCADE;
