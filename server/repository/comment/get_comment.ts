import pool from "~~/server/utils/db_config"

export const GetCommentRepository = async (id_foto: number) => {
    try {
        const SQL_QUERY_GET = `SELECT * FROM public.foto_comment WHERE id_foto = $1`

        const result = await pool.query(SQL_QUERY_GET, [id_foto])

        if(result.rowCount)
            return {
                status: 200,
                message: "Berhasil mengambil komentar",
                datas: result.rows
            }
        else return null
    } catch (error) {
        console.log(error)
    }
}