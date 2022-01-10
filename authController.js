import User from './models/user.js'
import Role from './models/role.js'
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'

class AuthController {
    async registration(req, res) {
        try {
            // проверяем наличие ошиббок валидации
            const errors = validationResult(req) 
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'ошибка при регистрации', errors })
            }
            // вытаскиваем логин и пароль из  тела запроса
            const {username, password} = req.body
            // проверяем есть ли у нас в базе пользователь с таким именем
            const candidate = await User.findOne({username: username})
            if(candidate){
                // если есть возвращаем ошибку
                return res.status(400).json({message: 'Такой пользователь уже зарегистрирован'})
            }
            // иначе получаем роль из БД
            const userRole = await Role.findOne({value: 'USER'})
            // создаем нового пользователя
            const user = new User({
                username,
                // хешируем пароль с помощью bcrypt
                password: bcrypt.hashSync(password, 7),
                roles: [userRole.value]
            })
            // сохраняем пользователя
            await user.save()
            // возвращаем результат на клиент
            res.json({message: 'Пользователь успешно создан'})
        } catch (error) {
            console.log(error)
            res.status(400).json({massage: error})
        }
    }

    async login(req, res) {
        try {
            
        } catch (error) {
            console.log(error)
            res.status(400).json({massage: error})
        }
    }

    async getUsers(req, res) {
        try {
            const userRole = new Role()
            const adminRole = new Role({value: 'ADMIN'})
            await userRole.save()
            await adminRole.save()
            res.json('server works')
            
        } catch (error) {
            
        }
    }
}

export default new AuthController()

