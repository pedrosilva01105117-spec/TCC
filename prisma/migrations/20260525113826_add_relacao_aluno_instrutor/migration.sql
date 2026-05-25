-- CreateTable
CREATE TABLE "Alunos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "idade" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "plano" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "instrutores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "idade" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_AlunosToinstrutores" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlunosToinstrutores_A_fkey" FOREIGN KEY ("A") REFERENCES "Alunos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlunosToinstrutores_B_fkey" FOREIGN KEY ("B") REFERENCES "instrutores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlunosToinstrutores_AB_unique" ON "_AlunosToinstrutores"("A", "B");

-- CreateIndex
CREATE INDEX "_AlunosToinstrutores_B_index" ON "_AlunosToinstrutores"("B");
