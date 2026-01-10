import zod from "zod"
import pool from "~~/server/utils/db_config"
import { LoginUserSchema } from "~~/server/utils/schema"
import  bcrypt from "bcrypt"

export const LoginUserRepository = async (datas: zod.infer<typeof LoginUserSchema>) => {
    try {
        const resultParse = LoginUserSchema.safeParse(datas)
        
        if(!resultParse.success) return

        const SQL_GET_QUERY_USERNAME = 
        `SELECT id_user, username, email, password FROM public.user WHERE username = $1`

        const result1 = await pool.query(SQL_GET_QUERY_USERNAME, [resultParse.data.username])

        if(!result1.rowCount){
            return {
                status: 400,
                message: "Username Salah"
            }
        }

        const isMatch = await bcrypt.compare(resultParse.data.password, result1.rows[0].password)

        if(!isMatch) {
            return {
                status: 400,
                message: "Password Salah"
            }
        }

        return {
            status: 200, 
            message: "Berhasil Login",
            datas: {
                id_user: result1.rows[0].id_user,
                username: result1.rows[0].username,
            }
        }
    } catch (error) {
        console.log(error)
    }
}