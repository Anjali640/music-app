const musicModel = require("../models/music.model")
const { uploadFiles } = require("../services/storage.service")
const albumodel= require("../models/album.model")
const jwt = require("jsonwebtoken")

async function createMusic(req, res) {
        const { title } = req.body
        const file = req.file

        if (!file) {   
            return res.status(400).json({
                message: "Music file is required"
            })
        }

        const result = await uploadFiles(file.buffer.toString("base64"))

        const music = await musicModel.create({
            uri: result.url,   
            title,
            artist: req.user.id   
        })

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        })

}

async function createAlbum(req, res) {
    
        const{ title, musics}= req.body

        const album=await albumodel.create({
            title,
            artist:req.user.id ,
            music: musics
        })
        res.status(201).json({
            message:"album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                music:album.music
            }
        })

    
}

async function getAllMusics(req, res) {
    const musics= await musicModel.find().limit(20).populate("artist","username email")
    res.status(200).json({
        message:"All musics fetched successfully",
        musics:musics,
    })
}

async function getAllAlbums(req, res){
    const albums= await musicModel.find().select("title artist ").populate("artist","username email")
    res.status(200).json({
        message:"Album fetched successfully",
        albums:albums,
    })
}

async function getAlbumById(req, res) {
    const albumId=req.params.albumId;
    const album= await albumodel.findById(albumId).populate("artist","username email")
     res.status(200).json({
        message:"Album fetched successfully",
        album:album,
    })
}



module.exports = { createMusic,createAlbum , getAllMusics, getAllAlbums,getAlbumById}