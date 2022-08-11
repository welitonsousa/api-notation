const { Client } = require('whatsapp-web.js');
import { Request, Response } from "express";

const client = new Client(); 
client.on('qr', (qr) => {
  console.log(qr);
});
client.initialize();


class ControllerMessage {
  async sendMessage(req: Request, res: Response){
    
    try{
      const {msg, number, key} = req.body
      if (process.env.wKey === key) {
        if (!msg || !number) {
          return res.status(300).json({message: "number or message invalid"})
        }
        else {
          await client.sendMessage(`${number}@c.us`, msg);
          return res.json({message: "success"})
        }
      }
    }catch(e){
      console.log(e);
      return res.status(500).json({message: "Erro no servidor"})
    }
  }
}