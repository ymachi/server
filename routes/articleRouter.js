import express from "express";
import {getAllArticles, getOneArticle,addArticle, editArticle, deleteArticle} from "../controllers/articleController.js"
import {isLogged, isAuthorized} from "../middlewares/auth.js"

const articleRouter = express.Router();


// Route pour ajouter un nouvel article
articleRouter.post("/new", isLogged, addArticle)

// pour modifier un article
articleRouter.put("/edit/:id", isLogged, editArticle) 

// pour supprimer un article
articleRouter.delete("/delete/:id", isLogged, deleteArticle)

// On créé un chemin dans URL pour accéder aux données
articleRouter.get("/",  getAllArticles)

articleRouter.get("/id", isLogged, getOneArticle)

export default articleRouter