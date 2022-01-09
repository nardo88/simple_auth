import { Router } from "express"
// импортируем контроллер
import AuthController from './authController.js'
// создаем экземпляр Router
const router = new Router()
// у нас будет два POST запроса, для регистрации и авторизации
router.post('/registration', AuthController.registration)
router.post('/login', AuthController.login)
// и один GET запрос для получения всех пользователей
router.get('/users', AuthController.getUsers) 

export default router

