import { CreateUserRepository } from "~~/server/repository/user/create_user"

export default defineEventHandler(async (event) => {
    if(event.method !== "POST")
        return{
            status: 400,
            message: "This endpoint use post method"
        }

    try {
        const datas = await readBody(event)

        if(Object.keys(datas).length === 0){
            return {
                status: 400,
                message: "NO any data in json"
            }
        }

        const result = await CreateUserRepository(datas)
        
        return {
            status: result?.status,
            message: result?.message
        }
    } catch (error) {
        console.log(error)
    }
})