import { LoginUserRepository } from "~~/server/repository/user/login_user"
import redis from "~~/server/utils/redis_config"

export default defineEventHandler(async (event) => {
    if(event.method !== "POST")
        return {
            status: 400,
            message: "This endpoint use post method"
        }

    const datas = await readBody(event)

    if(Object.keys(datas).length === 0)
        return {
            status: 400,
            message: "No any data in JSON"
        }
    
    try {
        const result = await LoginUserRepository(datas)

        if(result?.status !==  200) return result

        var token
        const username = result?.datas?.username
        const session = `session-${username}`

        token = await generateToken({datas: result.datas})

        if(token) await redis.setEx(session, 3600, token)       

        return result
    } catch (error) {
        console.log(error)
    }
})