import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/modelUser";
import * as jwt from "jwt-simple";
import * as bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";

class ControllerUser {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(433).json({
          message: "name, email e password são campos obrigatorios",
        });
      } else if (!EmailValidator.validate(email)) {
        return res.status(403).json({
          message: "email invalido",
        });
      } else if (password.length < 6) {
        return res.status(403).json({
          message: "password deve ter mais que 5 caracteres",
        });
      }

      const userRepository = getRepository(User);

      const userAlreadyExists = await userRepository.findOne({ email });
      if (userAlreadyExists) {
        return res.status(400).json({
          message: "Email já cadastrado",
        });
      }
      const hashP = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        name,
        email,
        password: hashP,
      });
      await userRepository.save(user);
      return res.json({
        message: "usuario criado",
      });
    } catch (error) {
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }

  async sign(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(433).json({
          message: "email e password são campos obrigatorios",
        });
      } else if (!EmailValidator.validate(email)) {
        return res.status(403).json({
          message: "email invalido",
        });
      } else if (password.length < 6) {
        return res.status(403).json({
          message: "password deve ter mais que 5 caracteres",
        });
      }

      const userRepository = getRepository(User);
      const userAlreadyExists = await userRepository.findOne({ email });

      if (!userAlreadyExists || "") {
        return res.status(404).json({
          message: "usuario não encontrado",
        });
      }
      const authorization = await bcrypt.compare(
        password,
        userAlreadyExists.password
      );
      if (authorization) {
        const token = jwt.encode(
          { id: userAlreadyExists.id },
          process.env.SECRET
        );
        return res.json({
          message: "login efetuado",
          user: userAlreadyExists.name,
          token,
        });
      }
      return res.status(401).json({
        message: "senha invalida",
      });

    } catch (error) {
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }
}

export { ControllerUser };
