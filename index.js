import express from "express"
import mongoose from "mongoose"
import router from './authRouter.js'

const PORT = 5000
// создаем экземпляр express
const app = express()
// сервер должен уметь парсить JSON
app.use(express.json())
// указываем какие router надо прослушивать
app.use('/auth', router)
// функция которая запускает сервер
const start = async () => {
    try{
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.qqf5x.mongodb.net/simpleAuth?retryWrites=true&w=majority')
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })

    }catch(e){
        console.log(e)
    }
}
// запускаем серв
start()



