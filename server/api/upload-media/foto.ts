import UploadFotoRepository from "~~/server/repository/upload-media/foto"

export default defineEventHandler(async (event) => {
    if(event.method !== "POST")
        return {
            status: 400,
            message: "This endpoint use post method"
        }
    
    const tokenJWT = getHeaders(event).authorization

    if(!tokenJWT) 
        return {
            status: 400,
            message: "You dont have any authorization"
        }

    const resultVerify = await verifyJWT(tokenJWT)

    if(resultVerify === false) 
        return {
            status: 400,
            message: "Token Salah"
        }
    
    const datas = await readFormData(event)

    const id_user = datas.get("id_user")

    const foto = datas.get("file")

    const title_foto = datas.get("title")

    const description_foto = datas.get("description")

    if(!id_user || !foto || !title_foto || !description_foto) return

    const formData = new FormData()

    formData.set("id_user", id_user)
    formData.set("file", foto)
    formData.set("title", title_foto)
    formData.set("description", description_foto)

    const result = await UploadFotoRepository(formData)

    return {
        status: result?.status,
        message: result?.message
    }
})