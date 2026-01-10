import zod from "zod"

export const CreateUserSchema = zod.object({
    username: zod.string(),
    email: zod.email(),
    password: zod.string()
})

export const LoginUserSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})