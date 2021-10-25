import { auth } from './utils/auth';
import { Router } from 'express'
import { ControllerUser } from './controllers/controllerUser';
import { patterResponse401 } from './utils/response401';
import { ControllerNotation } from './controllers/controllerNotation';

const router = Router();

const controllerUser = new ControllerUser();
router.post('/sign', controllerUser.sign);
router.post('/users', controllerUser.create);
router.post('/send/code-pass', controllerUser.sendMail);
router.post('/valide/code', controllerUser.valideCode);
router.put('/reset/pass', controllerUser.resetPass);

router.use(auth().initialize());

const controllerNotation = new ControllerNotation();
router.put('/user/picture', patterResponse401, controllerUser.putPicture);
router.put('/user/pass', patterResponse401, controllerUser.putPass);
// router.get('/user/me', patterResponse401, controllerUser.getme);

router.post('/notation', patterResponse401, controllerNotation.create);
router.get('/notation', patterResponse401, controllerNotation.getNotation);
router.put('/notation', patterResponse401, controllerNotation.putNotation);
router.delete('/notation/:id', patterResponse401, controllerNotation.deleteNotation);
router.delete('/notation/', patterResponse401, controllerNotation.deleteNotation);

export { router }