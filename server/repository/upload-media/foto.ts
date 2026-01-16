import pool from "~~/server/utils/db_config"

export default async function UploadFotoRepository(value: FormData) {
    const datas = value

    const foto = datas.get("file")

    const username = datas.get("username")

    const title = datas.get("title")

    const description = datas.get("description")

    if(!username || !title || !description) return

    const id_user = await getIdUseByUsername(username.toString())

    if(id_user === undefined) return

    if(!(foto instanceof File)) return

    const ext = foto.name.split('.').pop()
    const uniqueName = `${crypto.randomUUID()}.${ext}`

    try {
        const resultUpload = await clientCDN.storage.from('First').upload(uniqueName, foto)
        
        if(resultUpload.error)
            return {
                status: 400,
                message: "Upload Gagal"
            }

        const url_foto = await clientCDN.storage.from('First').getPublicUrl(resultUpload.data.path)

        const SQL_QUERY_INSERT = 
        `INSERT INTO public.foto (id_user, title_foto, description_foto, url_foto, created_at)
        VALUES ($1, $2, $3, $4, $5)`
        
        const result = await pool.query(SQL_QUERY_INSERT, [id_user, title, description, url_foto.data.publicUrl, new Date().toISOString()])
        
        if(!result.rowCount){
            return {
                status: 400,
                message: "Terjadi kesalahan"
            }
        }

        return {
            status: 200,
            message: "Berhasil Upload"
        }
    } catch (error) {
        console.log(error)
    }
}

const getIdUseByUsername = async (username: string) => {
    try {
        const SQL_GET_QUERY = `SELECT * FROM public.user WHERE username = $1`

        const result = await pool.query(SQL_GET_QUERY, [username])

        if(result.rowCount) return result.rows[0].id_user
        else return null
    } catch (error) {
        console.log(error)
    }
}