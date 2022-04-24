import { json, Response } from "express";
import { getRepository } from "typeorm";
import { MyReq } from "../interfaces/myReq";
import { Todo } from "../models/modelTodo";

class ControllerTodoList {
  async create(req: MyReq, res: Response) {
    try {
      const { title, tasks } = req.body;

      if (!title || !tasks) {
        return res.status(433).json({
          message: "Preencha todos os campos",
        });
      }
      const user_id = req.user.id;
      const repository = getRepository(Todo);
      const myTasks = JSON.stringify(tasks)
      
      const date = new Date();
      date.setHours(date.getHours() - 3);

      const todo = repository.create({title, userId: user_id, tasks: myTasks, updated_at: date, created_at: date});

      repository.save(todo);
      return res.json({
        message: "Lista criada com sucesso",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }
  async getTodos(req: MyReq, res: Response) {
    const data = req.query;

    try {
      const user_id = req.user.id;
      const repository = getRepository(Todo);
      let todoList = await repository.find({ userId: user_id });
      if (data.order_by === undefined) {
        data.order_by = "updated_at";
      }

      if (data.order_by === "created_at") {
        todoList = todoList.sort(function (a, b) {
          const c = new Date(a.created_at);
          const d = new Date(b.created_at);
          return c.getTime() - d.getTime();
        });
      } else if (data.order_by === "title") {
        todoList = todoList.sort((a, b) => (a.title > b.title ? 1 : -1));
      } else if (data.order_by === "updated_at") {
        todoList = todoList.sort(function (a, b) {
          const c = new Date(a.updated_at);
          const d = new Date(b.updated_at);
          return c.getTime() - d.getTime();
        });
      }
      if (data.reverse === "true" || data.reverse === undefined) {
        todoList.reverse();
      }

      const response = []
      todoList.forEach((e) => {
        response.push({
          ...e,
          tasks: JSON.parse(e.tasks)
        })
      })

      return res.json({
        message: "sucesso",
        order_by: data.order_by,
        reverse: data.reverse === "true" || data.reverse === undefined,
        todos: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }

  async deleteTodo(req: MyReq, res: Response) {
    try {
      let id = req.params.id;
      const user_id = req.user.id;
      if (!id) {
        id = req.body;
      }
      if (!id) {
        return res.status(433).json({
          message: "id é um campo obrigatório",
        });
      }
      const repository = getRepository(Todo);
      const todo = await repository.findOne(id);
      if (todo && todo.userId == user_id) {
        await repository.delete(id);
        return res.json({
          message: "nota deletada",
        });
      }
      return res.status(404).json({
        message: "nota não encontrada",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }

  async putTodo(req: MyReq, res: Response) {
    try {
      const { id, title, tasks } = req.body;
      const user_id = req.user.id;

      if (!id || (!title && !tasks)) {
        return res.status(433).json({
          message: "Preencha todos os campos",
        });
      }
      const repository = getRepository(Todo);
      const todo = await repository.findOne(id);
      if (todo && todo.userId == user_id) {
        const date = new Date();
        date.setHours(date.getHours() - 3);
        await repository.update(id, {
          title: title || todo.title,
          tasks: tasks ? JSON.stringify(tasks) : todo.tasks,
          updated_at: date,
        });
        return res.json({
          message: "Lista atualizada",
        });
      }
      return res.status(404).json({
        message: "Lista não encontrada",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }
}

export { ControllerTodoList };
