import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/modelUser";
import * as jwt from "jwt-simple";
import * as bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";
import { MyReq } from "../interfaces/myReq";

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
      } else if (password.length < 8) {
        return res.status(403).json({
          message: "password deve ter no minimo 8 caracteres",
        });
      }

      const userRepository = getRepository(User);

      const userAlreadyExists = await userRepository.findOne({ email });
      if (userAlreadyExists) {
        return res.status(400).json({
          message: "Email já cadastrado",
        });
      }
      console.log(process.env.SECRET);
      
      const hashP = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        name,
        email,
        password: hashP,
        picture: null,
      });
      await userRepository.save(user);
      return res.json({
        message: "usuario criado",
      });
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }

  async putPicture(req: MyReq, res: Response) {
    try {
      const { picture } = req.body;
      const user_id = req.user.id;

      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne(user_id);

      if (userAlreadyExists) {
        await repository.update(user_id, { picture });
        return res.json({
          message: 'foto de perfil atualizada'
        });
      }
      return res.status(404).json({
        message: 'usuário não encontrado'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async putPass(req: MyReq, res: Response) {
    try {
      const { pass, new_pass } = req.body;
      const user_id = req.user.id;

      console.log(new_pass);
      
      if (!new_pass || new_pass.length < 8) {
        return res.status(403).json({
          message: "new_pass deve ter no minimo 8 caracteres",
        });
      }
      
      if (!pass || pass.length < 8) {
        return res.status(403).json({
          message: "pass deve ter no minimo 8 caracteres",
        });
      }
      
      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne(user_id);

      const authorization = await bcrypt.compare(
        pass,
        userAlreadyExists.password
      );

      if (authorization) {
        if (userAlreadyExists && userAlreadyExists.password) {
          const hashP = await bcrypt.hash(new_pass, 10);

          await repository.update(user_id, { password: hashP });
          return res.json({
            message: 'Senha atualizada'
          });
        }
      }
      return res.status(403).json({
        message: 'antiga senha invalida'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'erro interno'
      })
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
      } else if (password.length < 8) {
        return res.status(403).json({
          message: "password deve ter no minimo 8 caracteres",
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
      console.log(userAlreadyExists);
      
      if (authorization) {
        const token = jwt.encode(
          { id: userAlreadyExists.id },
          process.env.SECRET
        );
        return res.json({
          message: "login efetuado",
          user: userAlreadyExists.name,
          picture: userAlreadyExists.picture,
          token,
        });
      }
      return res.status(401).json({
        message: "senha invalida",
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "erro interno",
      });
    }
  }
}

export { ControllerUser };
