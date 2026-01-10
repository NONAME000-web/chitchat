import pool from "~~/server/utils/db_config"

export default async function UploadFotoRepository(value: FormData) {
    const datas = value

    const foto = datas.get("file")

    if(!(foto instanceof File)) return

    const ext = foto.name.split('.').pop()
    const uniqueName = `${crypto.randomUUID()}.${ext}`

    try {
        const result = await clientCDN.storage.from('First').upload(uniqueName, foto)
        
        if(result.error)
            return {
                status: 400,
                message: "Upload Gagal"
            }

        const url_foto = await clientCDN.storage.from('First').getPublicUrl(result.data.path)

        console.log(url_foto.data.publicUrl)
        
        return {
            status: 200,
            message: "Berhasil Upload"
        }
    } catch (error) {
        console.log(error)
    }
}