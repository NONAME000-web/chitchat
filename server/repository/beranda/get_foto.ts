import pool from "~~/server/utils/db_config"

export const GetFotoRepository = async () => {
    try {
        const SQL_QUERY_GET = `SELECT * FROM public.foto`
        const result = await pool.query(SQL_QUERY_GET)

        if(result.rowCount)
            return {
                status: 200,
                message: "Berhasil get konten foto",
                foto: result.rows
            }
        else
            return {
                status: 400,
                message: "Tidak ada konten foto"
            }
    } catch (error) {
        console.log(error)
    }
}