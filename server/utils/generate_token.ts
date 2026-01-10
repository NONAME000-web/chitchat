import jwt from "jsonwebtoken"

export const generateToken = async (value: any) => {
    try {
        const token = jwt.sign
        (value, useRuntimeConfig().public.jwt_Secret_Key, {expiresIn: "1h"})
        
        return token
    } catch (error) {
        console.log(error)
        return null
    }
}