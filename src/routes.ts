import { Router } from 'express'
import { ControllerUser } from './controllers/controllerUser';
import { ControllerNotation } from './controllers/controllerNotation';
import { auth } from './utils/auth';

const router = Router();

const controllerUser = new ControllerUser();
router.post('/sign', controllerUser.sign);
router.post('/users', controllerUser.create);

router.use(auth().initialize());

const controllerNotation = new ControllerNotation();
router.post('/notation', auth().authenticate(), controllerNotation.create);
router.get('/notation', auth().authenticate(), controllerNotation.getNotation);
router.put('/notation', auth().authenticate(), controllerNotation.putNotation);
router.delete('/notation', auth().authenticate(), controllerNotation.deleteNotation);

export { router }