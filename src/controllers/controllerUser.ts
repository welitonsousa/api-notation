import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/modelUser";
// import * as jwt from "jwt-simple";
import * as bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";
import { MyReq } from "../interfaces/myReq";
import nodemailer from "nodemailer";
import { Hashs } from "../models/modelHash";
import { emialReset } from "../utils/emailTamplate";
import admin from "firebase-admin";
import jwt from 'jsonwebtoken';

class ControllerUser {

  async sendMail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(433).json({
          message: "email é campo obrigatorio",
        });
      }

      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne({ email });

      if (userAlreadyExists) {
        const hash = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const repositoryHash = getRepository(Hashs);
        const data = await repositoryHash.create({
          hash,
          email,
        });
        await repositoryHash.save(data);

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
          }
        });
        const mailOptions = {
          from: 'App notation',
          to: email,
          subject: "Recuperação de senha",
          html: emialReset(hash),
        };
        transporter.sendMail(mailOptions, () => { });
        return res.json({
          message: "Enviamos um email com um código unico",
        });
      }
      return res.status(403).json({
        message: "email não encontrado",
      });
    } catch (error) {
      return res.status(500).json({
        message: "erro",
      });
    }
  }

  async resetPass(req: Request, res: Response) {
    try {
      const { email, hash, password } = req.body;

      if (!email || !hash || !password) {
        return res.status(433).json({
          message: "email, senha e código são obrigatórios",
        });
      }
      if (!password || password.length < 8) {
        return res.status(405).json({
          message: "a nova senha deve ter no minimo 8 caracteres",
        });
      }

      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne({ email });
      if (userAlreadyExists) {
        const repositoryHash = getRepository(Hashs);
        const hashExist = await repositoryHash.findOne({ hash })
        if (hashExist && hashExist.email == email && hashExist.valid && hashExist.created_at) {
          const date = new Date(hashExist.created_at);
          const now = new Date();

          const difference = now.getTime() - date.getTime();
          const minutes = Math.round(difference / 60000);

          if (minutes <= 5) {
            const hashP = await bcrypt.hash(password, 10);
            await repository.update(userAlreadyExists.id, { password: hashP, valid_sign: Date() });
            await repositoryHash.update(hashExist.id, { valid: false });
            await repositoryHash.delete(hashExist.id);

            return res.json({
              message: 'Senha atualizada'
            });
          }
        }
        return res.status(405).json({
          message: "código inválido",
        });

      }
      return res.status(404).json({
        message: "email não encontrado",
      });
    } catch (error) {
      return res.status(500).json({
        message: "erro",
      });
    }
  }

  async valideCode(req: Request, res: Response) {
    try {
      const { email, hash } = req.body;

      if (!email || !hash) {
        return res.status(433).json({
          message: "email e código são obrigatórios",
        });
      }


      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne({ email });
      if (userAlreadyExists) {
        const repositoryHash = getRepository(Hashs);
        const hashExist = await repositoryHash.findOne({ hash })
        if (hashExist && hashExist.email == email && hashExist.valid && hashExist.created_at) {
          const date = new Date(hashExist.created_at);
          const now = new Date();

          const difference = now.getTime() - date.getTime();
          const minutes = Math.round(difference / 60000);

          if (minutes <= 5) {
            return res.json({
              message: 'código valido'
            });
          }
        }
        return res.status(404).json({
          message: "código inválido",
        });

      }
      return res.status(404).json({
        message: "email não encontrado",
      });
    } catch (error) {
      return res.status(500).json({
        message: "erro",
      });
    }
  }

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
        return res.status(403).json({
          message: "Email já cadastrado",
        });
      }
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
      return res.status(500).json({
        message: "erro interno",
      });
    }
  }

  async getme(req: MyReq, res: Response) {
    try {
      const user_id = req.user.id;
      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne(user_id);

      if (userAlreadyExists) {
        return res.json({
          message: "usuário encontrado",
          user: userAlreadyExists.name,
          picture: userAlreadyExists.picture,
        });

      } else {
        return res.status(404).json({
          message: 'usuário não encontrado'
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async putPicture(req: MyReq, res: Response) {
    try {

      const user_id = req.user.id;

      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne(user_id);

      if (userAlreadyExists) {
        const formidable = require('formidable');
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
          try {
            const bucket = admin.storage().bucket(process.env.BUCKET_NAME);
            const name = `${new Date().getTime()}${files.files.name}`
            const response = await bucket.upload(files.files.path, { destination: name, public: true, private: false });
            const picture = response[0].publicUrl();
            await repository.update(user_id, { picture });
            return res.status(200).send({
              message: 'foto de perfil atualizada',
              picture
            });
          } catch (error) {
            return res.status(503).json({
              message: 'Não foi possível atualizar sua foto'
            });
          }
        });
      } else {
        return res.status(404).json({
          message: 'usuário não encontrado'
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'erro interno'
      })
    }
  }

  async putPass(req: MyReq, res: Response) {
    try {
      const { pass, new_pass, logout } = req.body;
      const user_id = req.user.id;

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
          if (logout) {
            await repository.update(userAlreadyExists.id, { valid_sign: Date() })
          }

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

      if (authorization) {
        const date = Date();

        const token = jwt.sign(
          {
            id: userAlreadyExists.id,
            date: date,
          },
          process.env.SECRET,
        );
        if (!userAlreadyExists.valid_sign) {
          await userRepository.update(userAlreadyExists.id, { valid_sign: date })
        }
        return res.json({
          message: "login efetuado",
          user: userAlreadyExists.name,
          picture: userAlreadyExists.picture,
          token,
        });
      } else {
        return res.status(403).json({
          message: "senha invalida",
        });
      }

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "erro interno",
      });
    }
  }
}

export { ControllerUser };
