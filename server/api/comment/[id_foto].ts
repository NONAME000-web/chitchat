import { GetCommentRepository } from "~~/server/repository/comment/get_comment"
//endpoint untuk get_comment
export default defineEventHandler(async (event) => {
    if(event.method !== "GET")
        return {
            status: 400,
            message: "This endpoint use get method"
        }
    
    const id_foto = event.context.params?.id_foto

    // const query = getQuery(event)
 
    // const index = Number(query.indexPage)

    if(!id_foto) return

    try {
        const result = await GetCommentRepository(Number(id_foto))

        return result
    } catch (error) {
        console.log(error)
    }
})
