import Article from "../models/articleModel.js";
import User from "../models/userModel.js";
import mongoose from 'mongoose';

// Controller pour récupérer tous les articles
export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate('creator');
        res.status(200).json(articles);
    } catch (e) {
        res.status(400).json({ message: "Impossible de récupérer les articles" });
    }
};

export const getOneArticle = async (req, res) => {
    try {
       
       const {id} = req.params;
       
       const article = await Article.findById(id)
       
       res.status(200).json(article)
    } catch (e) {
       res.status(400).json({message: "Impossible de récupérer cet article."})
    }
 }
// Controller pour ajouter un nouvel article
export const addArticle = async (req, res) => {
    const { title, content, imageUrl, creator } = req.body;
  
    if (!title || !content || !imageUrl || !creator) {
      return res.status(400).json({ message: "Tous les champs sont requis !" });
    }
  
    try {
    
      const user = await User.findById(creator);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      // création de l'article
      const newArticle = new Article({
        title,
        content,
        imageUrl,
        creator, 
      });
  
      await newArticle.save();
      res.status(201).json({ message: "Article créé avec succès !" });
    } catch (e) {
      res.status(500).json({ message: "Erreur lors de la création de l'article" });
      console.error(e);
    }
  };
  

// Controller pour modifier un article
export const editArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, imageUrl, content } = req.body;

        const editArticle = {
            title,
            imageUrl,
            content
        };

        await Article.findByIdAndUpdate(id, editArticle);
        res.status(200).json({ message: "Article bien mis à jour" });
    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "Impossible de mettre à jour l'article" });
    }
};

// Controller pour supprimer un article
export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID d'article invalide" });
        }

        // Vérification si l'article existe
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ message: "Article non trouvé" });
        }

        // Suppression de l'article
        await Article.findByIdAndDelete(id);
        res.status(200).json({ message: "Article supprimé avec succès" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: "Impossible de supprimer cet article" });
    }
};
