import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'
import { Todos } from './entities/Todos'

export const createUser = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.first_name) throw new Exception("Please provide a first_name")
    if (!req.body.last_name) throw new Exception("Please provide a last_name")
    if (!req.body.email) throw new Exception("Please provide an email")
    if (!req.body.password) throw new Exception("Please provide a password")

    const userRepo = getRepository(Users)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { email: req.body.email } })
    if (user) throw new Exception("Users already exists with this email")

    const newUser = getRepository(Users).create(req.body);  //Creo un usuario
    const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
    return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(Users).find();
    return res.json(users);
}

export const getTodosByUser = async (req: Request, res: Response): Promise<Response> => {
    // we can pass a second param to the findOne with the extra relations that we need
    const todo = await getRepository(Todos).find({ where: { user: req.params.id_user }});
    if (!todo) throw new Exception("Not Todo found", 404)

    return res.json(todo);
}


//CREA TODO
export const createTodo = async (req: Request, res: Response): Promise<Response> => {
    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.label) throw new Exception("Please provide a label")
    if (!req.body.done) throw new Exception("Please provide a done")

    const userRepo = getRepository(Users)
    const user = await userRepo.findOne({ where: { id: req.params.id_user } });
    if (!user) {
        throw new Exception("Not User found")
    }
    else {
        const todoRepo = getRepository(Todos);
        const todo = new Todos();
        todo.label = req.body.label;
        todo.done = req.body.done;
        todo.user = user; //GUARDO RELACION CON USERS
        const newTodo = getRepository(Todos).create(todo);  //Creo un todo
        const results = await getRepository(Todos).save(newTodo); //Grabo el nuevo todo
        return res.json(results);
    }

}

//MODIFICA TODO
export const updateTodo = async (req: Request, res: Response): Promise<Response> => {
    const todoRepo = getRepository(Todos) // I need the userRepo to manage users

    // find user by id
    const todo = await todoRepo.findOne({ where: { user: req.params.id_user, id: req.params.id_todo } });
    if (!todo) throw new Exception("Not Todo found");

    // better to merge, that way we can do partial update (only a couple of properties)
    todoRepo.merge(todo, req.body);
    const results = await todoRepo.save(todo);  // commit to DM	
    return res.json(results);
}

//BORRA USUARIO Y TODOS
export const deleteTodosAndUser = async (req: Request, res: Response): Promise<Response> => {
    const user = await getRepository(Users).findOne(req.params.id_user);
    if (!user) {
        throw new Exception("Not User found");
    }
    else {
        const result = await getRepository(Users).delete(req.params.id_user);
        return res.json(result);
    }

}
