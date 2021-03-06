
/**
 * Public Routes are those API url's that anyone can request
 * whout having to be logged in, for example:
 * 
 * POST /user is the endpoint to create a new user or "sign up".
 * POST /token can be the endpoint to "log in" (generate a token)
 */
import { Router } from 'express';
import { safe } from './utils';
import * as actions from './actions';

const router = Router();

// signup route, creates a new user in the DB
router.post('/user', safe(actions.createUser));
//Obtiene todos de un usuario en particular
router.get('/todos/user/:id_user', safe(actions.getTodosByUser));
//Crea un nuevo todo para un usuario
router.post('/todos/user/:id_user', safe(actions.createTodo));
//Modifica un todo para un usuario
router.put('/todos/user/:id_user/:id_todo', safe(actions.updateTodo));
//Elimina un usuario y sus todos
router.delete('/todos/user/:id_user', safe(actions.deleteTodosAndUser));

export default router;
