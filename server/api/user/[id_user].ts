import { GetUserRepository } from "~~/server/repository/user/get_user"

export default defineEventHandler(async (event) => {
    if(event.method !== "GET")
        return {
            status: 400,
            message: "This endpoint use get method"
        }
    
    const id_user = Number(event.context.params?.id_user)

    if(!id_user) return

    try {
        const result = await GetUserRepository(id_user)

        return result
    } catch (error) {
        console.log(error)
    }
})