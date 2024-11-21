import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true, 
        minLength: 5,
        maxLength: 255,
    },
    

    
    imageUrl: {
        type: String,
        required: true,
        default: "default-profil.jpg"
    },
    
    content: {
        type: String, 
        required: true,
        minLength: 5,
        maxLength: 3000
    },
    
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User", 
        required: true
    },
    
    
},{
    timestamps: true //  Il va vous créer 2 nouveaux champs : createdAt et updatedAt
})

const Article = mongoose.model("Article", articleSchema)

export default Article;