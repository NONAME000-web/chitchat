import { PostLikeRepository } from "~~/server/repository/like/post_like"

export default defineEventHandler(async (event) => {
    if(event.method !== "POST")
        return {
            status: 400,
            message: "This endpoint use post method"
        }
    
    const token = getHeaders(event).authorization

    if(!token)
        return{
            status: 400,
            message: "User dont have any token"
        }
    
    const verifyToken = await verifyJWT(token)

    if(!verifyToken)
        return {
            status: 400,
            message: "Token is not valid"
        }
    
    const datas = await readBody(event)

    if(datas === undefined)
        return{
            status: 400,
            message: "The request doesnt have any body"
        }
    
    try {
        const result = await PostLikeRepository(datas)

        return result
    } catch (error) {
        console.log(error)
    }
})