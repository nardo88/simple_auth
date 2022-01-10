import { Router } from "express"
// импортируем контроллер
import AuthController from './authController.js'
// импортируем метод check для валидации
import {check} from 'express-validator'
// создаем экземпляр Router
const router = new Router()
// у нас будет два POST запроса, для регистрации и авторизации
router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({min: 4, max: 10}),
], AuthController.registration)
router.post('/login', AuthController.login)
// и один GET запрос для получения всех пользователей
router.get('/users', AuthController.getUsers) 

export default router

