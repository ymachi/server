import mongoose from "mongoose"; 
import dotenv from "dotenv";

// odm
dotenv.config();

// permet de me connecter à une base de données existantes
export const connectDB = mongoose.connect(`${process.env.CONNECTION_STRING}`)

// si la connexion fonctionne
mongoose.connection.on("open", () => {
   console.log(`Database connexion etablished`)
})

// si la connexion échoue
mongoose.connection.on("error", () => {
   console.log(`Error, impossible to connect with DB`)
})