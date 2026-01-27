import pool from "~~/server/utils/db_config"
type DataLike = {
    id_foto: number
    username: string
    amount_like: number
}

export const PostLikeRepository = async (Datas: DataLike) => {
    try {
         const SQL_QUERY_INSERT = 
         `INSERT INTO foto_like(id_foto, username, likes) VALUES ($1, $2, $3)`

         const result = await 
         pool.query(SQL_QUERY_INSERT, [Datas.id_foto, Datas.username, Datas.amount_like])

         if(result.rowCount)
            return {
                status: 200,
                message: "Berhasil post like"
            }
        else
            return {
                status: 400,
                message: "Something went wrong"
            }
    } catch (error) {
        console.log(error)
    }
}