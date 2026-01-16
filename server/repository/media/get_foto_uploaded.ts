import pool from "~~/server/utils/db_config"

export const GetFotoUploadedRepository = async (username: string) => {
    try {
        const id_user = await getIdUserByUsername(username)

        if(!id_user) return {status: id_user.status, message: id_user.message}

        const SQL_QUERY_GET = `SELECT * FROM public.foto WHERE id_user = $1`
        const result = await pool.query(SQL_QUERY_GET, [id_user])
        
        if(result.rowCount)
            return {
                status: 200,
                message: "Berhasil mengambil foto",
                datas: result.rows
            }
        else 
            return {
                status: 400,
                message: "Anda belum upload foto"
            }   
    } catch (error) {
        console.log(error)
    }
}

const getIdUserByUsername = async (username: string) => {
    try {
        const SQL_QUERY_GET = `SELECT * FROM public.user WHERE username = $1`

        const result = await pool.query(SQL_QUERY_GET, [username])

        if(result.rowCount) return result.rows[0].id_user
        else return undefined
    } catch (error) {
        console.log(error)
        return {
            status: 400,
            message: "Something went wrong"
        }
    }
}