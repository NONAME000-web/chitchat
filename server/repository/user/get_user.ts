import pool from "~~/server/utils/db_config"

export const GetUserRepository = async (id_user: number) => {
    try {
        const SQL_QUERY_GET = `SELECT * FROM public.user WHERE id_user = $1`
        const result = await pool.query(SQL_QUERY_GET, [id_user])

        if(result.rowCount)
            return{
                status: 200,
                message: "Berhasil mengambil user",
                datas: result.rows[0]
            }
        else return {
            status: 400,
            message: "User tidak ada"
        }
    } catch (error) {
        console.log(error)
    }
}