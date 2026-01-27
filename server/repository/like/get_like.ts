import pool from "~~/server/utils/db_config"

export const GetLikeRepository = async (id_foto: number) => {
    try {
        const SQL_QUERY_GET = 
        `SELECT SUM(likes) AS total_likes FROM foto_like WHERE id_foto = $1`

        const result = await pool.query(SQL_QUERY_GET, [id_foto])

        const total_likes = result.rows[0].total_likes

        if(result.rowCount && total_likes)
            return{
                status: 200,
                message: "Berhasil ngambil data like",
                total_likes: total_likes
            }
        else {
            return {
                status: 400,
                message: "Tidak ada like"
            }
        }
    } catch (error) {
        console.log(error)
    }
}