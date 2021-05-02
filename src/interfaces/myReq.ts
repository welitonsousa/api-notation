import { Request } from 'express';

interface UserReq{
  id: string;
}

interface MyReq extends Request {
  user: UserReq;
}

export { MyReq }