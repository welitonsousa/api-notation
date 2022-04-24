import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/modelUser";
import nodemailer from "nodemailer";


class ControllerContact {
  async sendMail(req: Request, res: Response) {
    try {
      const { email, body, motivation } = req.body;
      if (!email || !body || !motivation) {
        return res.status(433).json({
          message: "Preencha todos os campos",
        });
      }
      const repository = getRepository(User);
      const userAlreadyExists = await repository.findOne({ email });

      if (userAlreadyExists ) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
          }
        });
        const mailOptions = {
          from: email,
          to: 'welitonubuntu@gmail.com',
          subject: motivation,
          body: body,
        };
        await transporter.sendMail(mailOptions);
        return res.json({
          message: "Mensagem enviada com sucesso",
        });
      }
      return res.status(403).json({
        message: "Este email não esta cadastrado",
      });
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({
        message: "erro",
      });
    }
  }
}

export { ControllerContact }