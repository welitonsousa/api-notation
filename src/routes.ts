import { auth } from './utils/auth';
import { Router } from 'express'
import { ControllerUser } from './controllers/controllerUser';
import { patterResponse401 } from './utils/response401';
import { ControllerNotation } from './controllers/controllerNotation';
import { ControllerTodoList } from './controllers/controllerTodoList';
import { ControllerContact } from './controllers/controllerContact';

const router = Router();

const controllerUser = new ControllerUser();
const controllerContact = new ControllerContact()
const controllerNotation = new ControllerNotation();
const controllerTodo = new ControllerTodoList();

router.post('/sign', controllerUser.sign);
router.post('/contact', controllerContact.sendMail);
router.post('/users', controllerUser.create);
router.post('/send/code-pass', controllerUser.sendMail);
router.post('/valide/code', controllerUser.valideCode);
router.put('/reset/pass', controllerUser.resetPass);

router.use(auth().initialize());

router.put('/user/picture', patterResponse401, controllerUser.putPicture);
router.put('/user/pass', patterResponse401, controllerUser.putPass);
router.get('/user/me', patterResponse401, controllerUser.getme);

router.post('/notation', patterResponse401, controllerNotation.create);
router.get('/notation', patterResponse401, controllerNotation.getNotation);
router.put('/notation', patterResponse401, controllerNotation.putNotation);
router.delete('/notation/:id', patterResponse401, controllerNotation.deleteNotation);
router.delete('/notation/', patterResponse401, controllerNotation.deleteNotation);

router.post('/todo', patterResponse401, controllerTodo.create);
router.get('/todo', patterResponse401, controllerTodo.getTodos);
router.put('/todo', patterResponse401, controllerTodo.putTodo);
router.delete('/todo/:id', patterResponse401, controllerTodo.deleteTodo);
router.delete('/todo/', patterResponse401, controllerTodo.deleteTodo);

//axios.delete('/todo?id=1')
//axios.delete('/todo', 
// {data: {id: 1}}
//)

export { router }