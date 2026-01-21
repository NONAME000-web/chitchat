export const UploadMedia = async (uniqueName: string, foto: File) => {
    try {
        const result = await clientCDN.storage.from('First').upload(uniqueName, foto)

        if(result && result.error)
            return {
                status: 400,
                message: "Upload Gagal"
            }

        const url_foto = await clientCDN.storage.from('First').getPublicUrl(result.data.path)

        return url_foto
    } catch (error) {
        console.log(error)
        return null
    }
}