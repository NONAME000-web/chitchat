export default defineEventHandler(async (event) => {
    if(event.method !== "POST") 
        return {
            status: 400,
            message: "This endpoint use post method"
        }
    
    
})