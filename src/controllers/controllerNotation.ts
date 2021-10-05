import { Response } from 'express';
import { getRepository } from 'typeorm';
import { MyReq } from '../interfaces/myReq';
import { Notation } from '../models/modelNotation';

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
      let id = req.params.id;
      const user_id = req.user.id;
      if (!id) {
        id = req.body;
      }      
      if (!id){
        return res.status(433).json({
          message: 'id é um campo obrigatório'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      if(note && note.user_id == user_id){
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
      const user_id = req.user.id;

      if (!id || (!title && !body)){
        return res.status(433).json({
          message: 'id e title ou body são campos obrigatórios'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      if(note && note.user_id == user_id){
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