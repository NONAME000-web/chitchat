import { GetFotoUploadedRepository } from "~~/server/repository/media/get_foto_uploaded"

export default defineEventHandler(async (event) => {
    if(event.method !== "GET")
        return {
            status: 400,
            message: "This endpoint use get method"
        }
    
    const username =  event.context.params?.username 

    if(!username || typeof username !== "string") return

    const tokenJWT = getHeaders(event).authorization

    if(!tokenJWT) 
        return {
            status: 400,
            message: "Your dont have any authorization"
        }

    const verifyToken = await verifyJWT(tokenJWT)

    if(verifyToken === false)
        return {
            status: 400,
            message: "Token tidak valid"
        }

    const result = await GetFotoUploadedRepository(username)

    return result
})