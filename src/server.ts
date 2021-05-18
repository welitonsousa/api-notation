import 'reflect-metadata';
import './database/index.ts';
import express from 'express';
import { router } from './routes';
import * as dotenv from 'dotenv';

const cors = require('cors')

dotenv.config();
const app = express();

app.use(cors);
app.use(express.json());
app.use(router);

const port = process.env.PORT|| 3000;
app.listen(port, () => console.info('server is running'));