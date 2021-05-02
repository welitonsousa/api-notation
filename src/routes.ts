import { auth } from './utils/auth';
import { Router } from 'express'
import { ControllerUser } from './controllers/controllerUser';
import { patterResponse401 } from './utils/response401';
import { ControllerNotation } from './controllers/controllerNotation';

const router = Router();

const controllerUser = new ControllerUser();
router.post('/sign', controllerUser.sign);
router.post('/users', controllerUser.create);

router.use(auth().initialize());

const controllerNotation = new ControllerNotation();
router.post('/notation', patterResponse401, controllerNotation.create);
router.get('/notation', patterResponse401, controllerNotation.getNotation);
router.put('/notation', patterResponse401, controllerNotation.putNotation);
router.delete('/notation', patterResponse401, controllerNotation.deleteNotation);

export { router }