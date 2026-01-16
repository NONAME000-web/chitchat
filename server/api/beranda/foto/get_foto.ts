import { GetFotoRepository } from "~~/server/repository/beranda/get_foto"

export default defineEventHandler(async (event) => {
    if(event.method !== "GET")
        return {
            status: 400,
            message: "This endpoint use get  method"
        }

    const result = await GetFotoRepository()

    return result
})