import pool from "~~/server/utils/db_config"

type Datas = {
    id_foto: number,
    username: string,
    comment: string,
    created_at: Date
}

export const PostCommentRepository = async (datas: Datas) => {
    try {
        const SQL_QUERY_INSERT = 
        `INSERT INTO public.foto_comment(id_foto, username, comment, created_at)
        VALUES ($1, $2, $3, $4)`

        const result = await pool.query(SQL_QUERY_INSERT, [datas.id_foto, datas.username, datas.comment, new Date().toISOString()])
        if(result.rowCount) 
            return {
                status: 200,
                message: "Berhasil Post Komentar"
            }
            
    } catch (error) {
        console.log(error)
        return{
                status: 400,
                message: "Something went wrong"
            }
    }
}