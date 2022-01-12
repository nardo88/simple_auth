import User from './models/user.js'
import Role from './models/role.js'
import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import config from './config.js'

// функция принимает id пользователя и его роли, что бы зашить в JWT эти данные
const generateAccessToken = (id, roles) => {
    // создаем объект который будет содержать необходимые данные
    const payload = {
        id, 
        roles
    }
    // метод sign генерирует JWT. В качестве аргумента он 
    // принимает объект с данными которые будут зашиты в токен
    // вторым аргументом нужно переждать секретный ключ
    // третьим аргументом мы передаем объект с параметрами токена. 
    // например передаем expiresIn - который говорит о том сколько будет жить токен
    // в нашем примере это 24 часа
    return jwt.sign(payload, config.secret, {expiresIn: '24h'})
}

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
            // вытаскиваем логин и пароль из тела запроса
            const {username, password} = req.body
            // затем находим в базе пользователя с таким логином
            const user = await User.findOne({username: username})
            // если пользователя нет, возращаем статус 404
            if(!user){
                return res.status(404).json({massage: `пользователь ${username} не найден`})
            }
            // validPassword будет в себе содержать будевое значение проверки на соответсвтие паролей
            // пароль в базе у нас захешированный поэтому воспользуется методом compareSync
            // который принимает сначала пароль обычный и затем захешированный пароль
            const validPassword = bcrypt.compareSync(password, user.password)
            // если пароль не валидный возвращаем ошибку
            if(!validPassword){
                return res.status(400).json({massage: `Не верный пароль`})
            }
            // создаем JWT
            const token = generateAccessToken(user._id, user.roles)
            res.json({token})

        } catch (error) {
            console.log(error)
            res.status(400).json({massage: error})
        }
    }

    async getUsers(req, res) {
        try {
            // получаем токен из заголовков
            const token = req?.headers?.authorization?.split(' ')[1] 
            if(!token){
                return res.status(400).json({massage: 'Пользователь не авторизован'})
            }
            // что бы вытащить из JWT зашифрованные данные воспользуемся методом verify
            // первым аргументом передаем токен, а вторым секретный ключ
            // decodedData будет содержать в себе объект с закодированными данными
            const decodedData = jwt.verify(token, config.secret)
            // если в закодированных ролях есть роль пользователя
            if(decodedData.roles.includes('USER')){
                // получаем всех пользователей
                const users = await User.find()
                // и высылаем на клиент
                return res.json(users)
            } else {
                // иначе возвращаем ошибку
                return res.json({message: 'Нет доступа'})
            }
            
        } catch (error) {
            console.log(error)
            res.status(400).json({massage: error})
        }
    }
}

export default new AuthController()

