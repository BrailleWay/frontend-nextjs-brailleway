/*
  Warnings:

  - Added the required column `senha` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medico" ADD COLUMN     "senha" VARCHAR(255) NOT NULL;
