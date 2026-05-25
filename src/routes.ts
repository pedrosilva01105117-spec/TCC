import { Router, Request, Response } from "express";
import { authentication } from "./middlewares/authentication";
import alunosController from "./controllers/AlunoAcademia";
import instrutorAcademiaController from "./controllers/instrutorAcademia";

const routes = Router();

routes.get("/", (_request: Request, response: Response) =>
  response.status(200).json({ succes: true }),
);

routes.get("/alunos", authentication, alunosController.list);
routes.post("/alunos", authentication, alunosController.create);
routes.get("/alunos/:id", authentication, alunosController.getByid);
routes.put("/alunos/:id", authentication, alunosController.update);
routes.delete("/alunos/:id", authentication, alunosController.delete);

routes.get("/instrutores", authentication, instrutorAcademiaController.list);
routes.get("/instrutor/:id", authentication, instrutorAcademiaController.getByid);
routes.post("/instrutor", authentication, instrutorAcademiaController.create);
routes.put("/instrutor/:id", authentication, instrutorAcademiaController.update)
routes.delete("/instrutor/:id", authentication, instrutorAcademiaController.delete)

routes.post('/matricular/:id', authentication, alunosController.matricular);
routes.delete('/desmatricular/:id', authentication, alunosController.desmatricular)

export default Router;