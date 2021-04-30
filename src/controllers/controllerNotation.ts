import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as jwt from 'jwt-simple'
import { Notation } from '../models/modelNotation';
import { User } from '../models/modelUser';

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

        const repository = getRepository(User);
        const user = await repository.findOne(user_id);
        if (!user) {
          return res.status(404).json({
            message: 'usuario não encontrado'
          })
        }
      }catch(error){
        return res.status(401).json({
          message: 'token invalido'
        });
      }
      
      const repository = getRepository(Notation);
      const notation = repository.create({title, body, user_id});
      
      repository.save(notation);
      return res.json({
        message: 'nota criada'
      });
    }catch(error){
      return res.status(500).json({
        message: 'erro interno'
      });
    } 
  }
  async getNotation(req: Request, res: Response){
    try{
      const { token } = req.headers;
      let user_id;
      try{
        user_id = jwt.decode((String(token)), process.env.SECRET).id || '';
        const repository = getRepository(User);
        const user = await repository.findOne(user_id);
        if (!user) {
          return res.status(404).json({
            message: 'usuario não encontrado'
          })
        }
        
      }catch(error){
        return res.status(401).json({
          message: 'token invalido'
        });
      }
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

  async deleteNotation(req: Request, res: Response){
    try{
      const { id } = req.body;
      if (!id){
        return res.status(433).json({
          message: 'id é um campo obrigatório'
        });
      }

      const { token } = req.headers;
      try{
        jwt.decode((String(token)), process.env.SECRET).id;
      }catch(error){
        return res.status(401).json({
          message: 'token invalido'
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

  async putNotation(req: Request, res: Response){
    try{
      const { id, title, body } = req.body;
      if (!id || !title || !body){
        return res.status(433).json({
          message: 'id, title e body são campos obrigatórios'
        });
      }

      const { token } = req.headers;
      try{
        jwt.decode((String(token)), process.env.SECRET).id;
      }catch(error){
        return res.status(401).json({
          message: 'token invalido'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      
      if(note){
        await repository.update(id ,{title, body});
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