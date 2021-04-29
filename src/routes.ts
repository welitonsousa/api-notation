import { Router } from 'express'
import { ControllerUser } from './controllers/controllerUser';
import { ControllerNotation } from './controllers/controllerNotation';

const router = Router();

const controllerUser = new ControllerUser();
router.post('/sign', controllerUser.sign);
router.post('/users', controllerUser.create);

const controllerNotation = new ControllerNotation();
router.post('/notation', controllerNotation.create);
router.get('/notation', controllerNotation.getNotation);
router.put('/notation', controllerNotation.putNotation);
router.delete('/notation', controllerNotation.deleteNotation);

export { router }