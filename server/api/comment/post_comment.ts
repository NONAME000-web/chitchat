import { PostCommentRepository } from "~~/server/repository/comment/post_comment"

export default defineEventHandler(async (event) => {
    if(event.method !== "POST")
        return {
            status: 400,
            message: "This endpoint use post method"
        }

    const tokenJWT = getHeaders(event).authorization

    if(!tokenJWT)
        return{
            status: 400,
            message: "You dont have any authorization"
        }

    try {
        const verifyToken = await verifyJWT(tokenJWT)
    
        if(verifyToken === false)
            return {
                status: 400,
                message: "Token Invalid"
            }
            
        const datas = await readBody(event)
        
        const result = await PostCommentRepository(datas)

        return result
    } catch (error) {
        console.log(error)
    }
})