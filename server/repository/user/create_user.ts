import zod from "zod"
import pool from "~~/server/utils/db_config"
import { CreateUserSchema } from "~~/server/utils/schema"
import bcrypt from "bcrypt"

export const CreateUserRepository = async (datas: zod.infer<typeof CreateUserSchema>) => {
    try {
        const resultParse = await CreateUserSchema.safeParse(datas)

        if(!resultParse.success) return
        
        const resultCheckEmail = await CheckEmailExist(resultParse.data?.email)

        if(resultCheckEmail === true)
            return {
                status: 400,
                message: "Email sudah ada"
            }

        const resultCheckUsername = await CheckUsernameExist(resultParse.data.username)

        if(resultCheckUsername === true)
            return{
                status: 400,
                message: "Username sudah ada"
            }
        
        const hashedPassword = await bcrypt.hash(resultParse.data.password, 10)

        const SQL_INSERT_QUERY = 
        `INSERT INTO public.user(username, email, password) 
        VALUES ('${resultParse.data.username}', '${resultParse.data.email}', '${hashedPassword}')`

        const result = await pool.query(SQL_INSERT_QUERY)

        if(result.rowCount !== 0){
            return {
                status: 200,
                message: "Berhasil register"
            }
        }
    } catch (error) {
        console.log(error)
    }
}

//method ini untuk memeriksa apakah data sudah ada di db
const CheckEmailExist = async (email: string) => {
    const SQL_GET_QUERY = `SELECT * FROM public.user WHERE email = ('${email}')`

    const result = await pool.query(SQL_GET_QUERY)
    
    if(!result.rowCount) return false
    else return true
}

const CheckUsernameExist = async (username: string) => {
    const SQL_GET_QUERY = `SELECT * FROM public.user WHERE username = ('${username}')`

    const result = await pool.query(SQL_GET_QUERY)

    if(!result.rowCount) return false
    else return true    
}