import { Response } from 'express';
import { getRepository } from 'typeorm';
import { MyReq } from '../interfaces/myReq';
import { Notation } from '../models/modelNotation';


class ControllerNotation {
  async create(req: MyReq, res: Response) {
    try {
      const { title, body } = req.body;

      if (!title || !body) {
        return res.status(433).json({
          message: 'title e body são campos obrigatórios'
        });
      }
      const user_id = req.user.id;
      const repository = getRepository(Notation);
      const date = new Date()
      date.setHours(date.getHours() - 3)
      const notation = repository.create({ title, body, user_id, updated_at: date });

      repository.save(notation);
      return res.json({
        message: 'nota criada com sucesso'
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'erro interno'
      });
    }
  }
  async getNotation(req: MyReq, res: Response) {
    const data = req.query;
    
    try {
      const user_id = req.user.id;
      const repository = getRepository(Notation);
      let notations = await repository.find({ user_id });
      if (data.order_by === undefined) {
        data.order_by = 'updated_at'
      }

      if (data.order_by === 'created_at') {
        notations = notations.sort(function (a, b) {
          const c = new Date(a.created_at)
          const d = new Date(b.created_at)
          return c.getTime() - d.getTime();
        });
      }
      else if (data.order_by === 'title') {
        notations = notations.sort((a, b) => (a.title > b.title) ? 1 : -1)
      }
      else if (data.order_by === 'updated_at') {
        notations = notations.sort(function (a, b) {
          const c = new Date(a.updated_at)
          const d = new Date(b.updated_at)
          return c.getTime() - d.getTime();
        });
      }
      if (data.reverse === 'true' || data.reverse === undefined) {
        notations.reverse()
      }

      return res.json({
        message: 'sucesso',
        order_by: data.order_by,
        reverse: data.reverse === 'true' || data.reverse === undefined,
        notations
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async deleteNotation(req: MyReq, res: Response) {
    try {
      let id = req.params.id;
      const user_id = req.user.id;
      if (!id) {
        id = req.body;
      }
      if (!id) {
        return res.status(433).json({
          message: 'id é um campo obrigatório'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      if (note && note.user_id == user_id) {
        await repository.delete(id);
        return res.json({
          message: 'nota deletada'
        });
      }
      return res.status(404).json({
        message: 'nota não encontrada'
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async putNotation(req: MyReq, res: Response) {
    try {
      const { id, title, body } = req.body;
      const user_id = req.user.id;

      if (!id || (!title && !body)) {
        return res.status(433).json({
          message: 'id e title ou body são campos obrigatórios'
        });
      }
      const repository = getRepository(Notation);
      const note = await repository.findOne(id)
      if (note && note.user_id == user_id) {
        const date = new Date()
        date.setHours(date.getHours() - 3)
        await repository.update(id, { title: title || note.title, body: body || note.body, updated_at: date });
        return res.json({
          message: 'nota atualizada'
        });
      }
      return res.status(404).json({
        message: 'nota não encontrada'
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }
}

export { ControllerNotation }