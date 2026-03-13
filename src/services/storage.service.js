const { ImageKit}= require('@imagekit/nodejs')

const imagekit= new ImageKit({
   privateKey:"private_olJPsiOlYAp/zOTjStrxk87QRHc="
})

async function uploadFiles(file) {
    const result= await imagekit.files.upload({
        file,
        fileName:"music_"+ Date.now(),
        folder:"Spotify/music"
    })
    return result;
    
}
module.exports={uploadFiles}
