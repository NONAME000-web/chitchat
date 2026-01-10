import { useCookie } from "nuxt/app"
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

        const expiresDate = new Date(Date.now() + 60 * 60 * 1000)
        setCookie(event, "id_user", result?.datas?.id_user, {expires: expiresDate})
        setCookie(event, "username", username, {expires: expiresDate})

        return {
            status: 200,
            message: "Berhasil Login"
        }
    } catch (error) {
        console.log(error)
    }
})