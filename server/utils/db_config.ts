import { Pool } from "pg"

const pool = new Pool({
    user: useRuntimeConfig().public.username_DB,
    password: useRuntimeConfig().public.password_DB,
    host: useRuntimeConfig().public.host_DB,
    database: useRuntimeConfig().public.database_Name
})

try {
    pool.on("connect", () => {
        console.log("Database On")
    })
} catch (error) {
    console.log(error)
}

export default pool