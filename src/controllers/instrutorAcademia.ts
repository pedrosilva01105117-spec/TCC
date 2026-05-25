import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";  
import { handleError } from "../../helpers/handleError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "process";


export default {
  login: async (request: Request, response: Response) => {
    try {
      const { email, senha } = request.body;

      if (!email || !senha) {
        return response.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const employee = await prisma.instrutores.findUnique({
        where: { email },
      });

      if (!employee || !bcrypt.compareSync(senha, employee.senha)) {
        return response.status(401).json({ error: "Email e/ou senha inválidos" });
      }

  
      const token = jwt.sign(
        { id: employee.id, email: employee.email, admin: employee.admin },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      return response.status(200).json({ access_token: token });
    } catch (e) {
      return handleError(e, response);
    }
  },

  create: async (request: Request, response: Response) => {
    try {
      const { nome, email, senha, admin, user } = request.body;

    
      if (!nome || !email || !senha) {
        return response.status(400).json({ error: "Dados do Instrutor incompletos" });
      }

      if (!user?.admin) {
        return response.status(403).json({ error: "Acesso negado" });
      }

      const employee = await prisma.instrutores.create({
        data: {
          nome,
          email,
          senha: bcrypt.hashSync(senha, +process.env.BCRYPT_ROUNDS!),
          admin,
        },
      });
      return response.status(201).json(employee);
    } catch (e) {
      return handleError(e, response);
    }
  },

  list: async (_request: Request, response: Response) => {
    try {
      const employees = await prisma.instrutores.findMany();
      return response.status(200).json(employees);
    } catch (e) {
      return handleError(e, response);
    }
  },

  getByid: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const employee = await prisma.instrutores.findUnique({
        where: { id: +id },
      });

      if (!employee) {
        return response.status(404).json({ error: "Instrutor não encontrado" });
      }

      return response.status(200).json(employee);
    } catch (e) {
      return handleError(e, response);
    }
  },

  update: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { nome, email, senha, admin, user } = request.body;

      if (!user?.admin && user?.id !== +id) {
        return response.status(403).json({ error: "Não autorizado" });
      }

      const employee = await prisma.instrutores.update({
        data: {
          nome,
          email,

          ...(senha && { senha: bcrypt.hashSync(senha, +process.env.BCRYPT_ROUNDS!) }),
          admin: user.admin ? admin : false,
        },
        where: { id: +id },
      });
      return response.status(200).json(employee);
    } catch (e) {
      return handleError(e, response);
    }
  },


  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { user } = request.body;

      if (!user?.admin) {
        return response.status(403).json({ error: "Acesso negado" });
      }

      const employee = await prisma.instrutores.delete({
        where: { id: +id },
      });
      return response.status(200).json(employee);
    } catch (e) {
      return handleError(e, response);
    }
  },
};