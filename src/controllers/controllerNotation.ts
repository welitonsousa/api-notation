import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as jwt from 'jwt-simple'
import { Notation } from '../models/modelNotation';

class ControllerNotation {
  async create(req: Request, res: Response) {
    try{
      const { title, body } = req.body;
      const { token } = req.headers;
      
      if(!title || !body){
        return res.status(433).json({
          message: 'title e body são campos obrigatórios'
        });
      }

      let user_id;
      try{
        user_id = jwt.decode((String(token)), process.env.SECRET).id || '';
      }catch(error){
        return res.status(401).json({
          message: 'token invalido'
        });
      }
      
      const repository = getRepository(Notation);
      const notation = repository.create({title, body, user_id});
      
      repository.save(notation);
      return res.json({
        message: 'Nota criada com sucesso'
      });
    }catch(error){
      return res.status(500).json({
        message: 'erro interno'
      });
    } 
  }
}

export { ControllerNotation }