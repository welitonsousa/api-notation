import { MyReq } from '../interfaces/myReq';
import { auth } from './auth';
import { Response } from 'express';

function patterResponse401 (req: MyReq, res: Response, next) {
  auth().authenticate((error, user, _) => {
    if (error || !user) {
      return res.status(401).json({
        message: 'usuário não autorizado'
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export { patterResponse401 }