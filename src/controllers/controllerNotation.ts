import { request, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as jwt from 'jwt-simple'
import { Notation } from '../models/modelNotation';
import { User } from '../models/modelUser';

interface UserReq{
  id: string;
}

interface MyReq extends Request {
  user: UserReq;
}


class ControllerNotation {
  async create(req: MyReq, res: Response) {
    try{
      const { title, body } = req.body;
      
      if(!title || !body){
        return res.status(433).json({
          message: 'title e body são campos obrigatórios'
        });
      }
      const user_id = req.user.id;
      console.log(user_id);
      
      const repository = getRepository(Notation);
      const notation = repository.create({title, body, user_id});
      
      repository.save(notation);
      return res.json({
        message: 'nota criada com sucesso'
      });
    }catch(error){
      return res.status(500).json({
        message: 'erro interno'
      });
    } 
  }
  async getNotation(req: MyReq, res: Response){
    try{
      const user_id = req.user.id;
      const repository = getRepository(Notation);
      const notations = await repository.find({user_id});

      return res.json({
        message: 'sucesso',
        notations
      });
    }catch(error){  
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async deleteNotation(req: MyReq, res: Response){
    try{
      const { id } = req.body;
      if (!id){
        return res.status(433).json({
          message: 'id é um campo obrigatório'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      if(note){
        await repository.delete(id);
        return res.json({
          message: 'nota deletada'
        });
      }
      return res.status(404).json({
        message: 'nota não encontrada'
      });
    }catch(error){
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async putNotation(req: MyReq, res: Response){
    try{
      const { id, title, body } = req.body;
      if (!id || (!title && !body)){
        return res.status(433).json({
          message: 'id e title ou body são campos obrigatórios'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      if(note){
        await repository.update(id ,{title: title || note.title, body: body || note.body});
        return res.json({
          message: 'nota atualizada'
        });
      }
      return res.status(404).json({
        message: 'nota não encontrada'
      });
    }catch(error){
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }
}

export { ControllerNotation }