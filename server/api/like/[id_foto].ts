import { GetLikeRepository } from "~~/server/repository/like/get_like"

export default defineEventHandler(async (event) => {
    if(event.method !== "GET")
        return {
            status: 400,
            message: "This endpoint use get method"
        }
    
    const id_foto = Number(event.context.params?.id_foto)

    if(!id_foto)
        return{
            status: 400,
            message: "Tidak ada parameter id foto"
        }
    
    try {
        const result = await GetLikeRepository(id_foto)

        return result
    } catch (error) {
        console.log(error)
    }
})