import jwt from "jsonwebtoken";

export const verifyJWT = async (token: string) => {
    try {
        const result = jwt.verify(token, useRuntimeConfig().public.jwt_Secret_Key)
        if(result) return true
    } catch (error) {
        return false
    }
}