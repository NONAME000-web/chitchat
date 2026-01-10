import { createClient } from "redis";

const redis = createClient({
    username: useRuntimeConfig().public.username_Redis,
    password: useRuntimeConfig().public.password_Redis,
    socket: {
        host: useRuntimeConfig().public.host_Redis,
        port: Number(useRuntimeConfig().public.port_Redis)
    }
})

redis.on("error", (err) => {
    console.log("Redis Error: ", err)
})

redis.connect()

redis.set("key", 5)

export default redis