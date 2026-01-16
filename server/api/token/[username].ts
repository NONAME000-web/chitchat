import redis from "~~/server/utils/redis_config"

export default defineEventHandler(async (event) => {
    if(event.method !== "GET")
        return {
            status: 400,
            message: "This endpoint use get method"
        }
    
    const username = event?.context?.params?.username

    if(!username) return

    const token = await redis.get(`session-${username}`)

    if(token)
        return {
            status: 200,
            message: "Berhasil mengambil token",
            token: token
        }
    else
        return {
            status: 400,
            message: "Token tidak ada"
        }
})