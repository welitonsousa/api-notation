import { Router } from 'express'
import { ControllerUser } from './controllers/controllerUser';
import { auth } from './utils/auth';

const router = Router();

const controllerUser = new ControllerUser();
router.post('/sign', controllerUser.sign);
router.post('/users', controllerUser.create);

// router.use(auth().initialize()); routes privates the dow

export { router }