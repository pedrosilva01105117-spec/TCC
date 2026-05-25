import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleError } from "../../helpers/handleError";

export default {
  create: async (request: Request, response: Response) => {
    try {
      const { nome, email, idade, cpf, dataNascimento, plano } = request.body;

      if (!nome || !email || !idade || !cpf) {
        return response.status(400).json({ error: "Dados do Aluno incompletos" });
      }

      const user = await prisma.Alunos.create({
        data: { 
          nome, 
          email, 
          idade, 
          cpf, 
          dataNascimento, 
          plano 
        },
      });

      return response.status(201).json(user);
    } catch (e) {
      return handleError(e, response);
    }
  },

  list: async (_request: Request, response: Response) => {
    try {
      const users = await prisma.Alunos.findMany({ include: { instrutores: true } });
      return response.status(200).json(users);
    } catch (e) {
      return handleError(e, response);
    }
  },

  getByid: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const user = await prisma.Alunos.findUnique({
        where: { id: +id },
        include: { instrutores: true },
      });

      if (!user) {
        return response.status(404).json({ error: "Aluno não encontrado" });
      }

      return response.status(200).json(user);
    } catch (e) {
      return handleError(e, response);
    }
  },

  update: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { nome, email, idade, cpf, dataNascimento, plano } = request.body;
      const user = await prisma.Alunos.update({
        data: { nome, email, idade, cpf, dataNascimento, plano },
        where: { id: +id },
      });
      return response.status(200).json(user);
    } catch (e) {
      return handleError(e, response);
    }
  },

  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const user = await prisma.Alunos.delete({ where: { id: +id } });
      return response.status(200).json(user);
    } catch (e) {
      return handleError(e, response);
    }
  },

  matricular: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { instrutoresIds } = request.body;

      if (!instrutoresIds || !Array.isArray(instrutoresIds) || instrutoresIds.length === 0) {
        return response.status(400).json({ error: "instrutoresIds é obrigatório" });
      }

      const user = await prisma.Alunos.update({
        where: { id: Number(id) },
        data: {
          instrutores: {
            connect: instrutoresIds.map((instrutorId: number) => ({ id: instrutorId })),
          },
        },
        include: { instrutores: true },
      });
      return response.status(201).json(user);
    } catch (e) {
      return handleError(e, response);
    }
  },

  desmatricular: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { instrutoresIds } = request.body;
      const alunoId = Number(id);

      const aluno = await prisma.Alunos.findUnique({
        where: { id: alunoId },
        include: { instrutores: true },
      });

      if (!aluno) {
        return response.status(404).json({ error: "Aluno não encontrado" });
      }

      const instrutoresQueFicam = aluno.instrutores
        .filter((instrutor: { id: number }) => !instrutoresIds.includes(instrutor.id))
        .map((instrutor: { id: number }) => ({ id: instrutor.id }));

      const user = await prisma.Alunos.update({
        where: { id: alunoId },
        data: { instrutores: { set: instrutoresQueFicam } },
        include: { instrutores: true },
      });
      return response.status(200).json(user);
    } catch (e) {
      return handleError(e, response);
    }
  },
};