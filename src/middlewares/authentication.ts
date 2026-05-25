import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response} from 'express';
import  instrutorAcademia  from '../controllers/instrutorAcademia';

export function authentication( request: Request, response: Response, next: NextFunction) {
    try {
    const authHeader = request.headers.authorization;

    if (!authHeader){
        return response.status(401).json({ error: "não autenticado" });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!request.body) {
    request.body = {};
    }
    request.body.user = decoded as typeof instrutorAcademia;

    next();
} catch (e) {        
    console.error(e);
    return response.status(401).json({ error: "não autenticado" });
    }
}
