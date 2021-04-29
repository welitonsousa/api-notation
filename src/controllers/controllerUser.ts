import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/modelUser';
import * as jwt from 'jwt-simple'
import * as bcrypt from 'bcryptjs';

class ControllerUser {
  async create(req: Request, res: Response) {    
    const { name, email, password } = req.body;

    const userRepository = getRepository(User);
    
    const userAlreadyExists = await userRepository.findOne({email});
    if (userAlreadyExists) {
      return res.status(400).json({
        message: 'Email já cadastrado'
      });
    }
    try{
      const hashP = await bcrypt.hash(password, 10);;      
      const user = userRepository.create({
        name, email, 'password': hashP
      });
      await userRepository.save(user);
      return res.json({
        message: 'usuario criado'
      });
      
    }catch(error){
      console.error(error);
    }
  }

  async sign (req: Request, res: Response) {
    const { email, password } = req.body;
    const userRepository = getRepository(User);
    const userAlreadyExists = await userRepository.findOne({email});

    if (!userAlreadyExists) {
      res.status(404).json({
        message: 'usuario não encontrado'
      })
    }
    const authorization = await bcrypt.compare(password, userAlreadyExists.password);
    if (authorization) {
      const token = jwt.encode({id: userAlreadyExists.id}, process.env.SECRET);
      res.json({
        message: 'login efetuado',
        token
      });
    }else {
      res.status(401).json({
        message: 'Email senha invalida',
      })
    }
  }
}

export { ControllerUser }