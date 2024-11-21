import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // PWD: 1 Maj, 1 minuscule, 1 caractère spécial, 1 chiffre entre 8 et 55 caractères
        const checkPwd = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*.-]).{8,55}$/
        
        // Sécurité
        if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
            return res.status(400).json({ message: "Veuillez remplir tous les champs" });
        }
        
        // Permet de savoir si l'utilisateur est déjà inscrit
        const verifEmail = await User.findOne({ email });
        if (verifEmail) {
            return res.status(401).json({ message: "Cet email est déjà enregistré" });
        }
        
        // Vérification du mot de passe respectant la regex
        if (!checkPwd.test(password)) {
            return res.status(401).json({ message: "Le mot de passe ne respecte pas les conditions" });
        }
        
        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);  // Générer un salt pour le hachage
        const hashedPassword = await bcrypt.hash(password, salt);  // Hacher le mot de passe
        
        // Créer un nouvel utilisateur avec le mot de passe haché
        const newUser = new User({
            email,
            username,
            password: hashedPassword,  // Utiliser le mot de passe haché
        });
        
        await newUser.save();  // Sauvegarder l'utilisateur dans la base de données
        
        res.status(200).json({ message: "Compte créé avec succès" });
    } catch (e) {
        res.status(400).json({ message: "Impossible de créer un compte" });
    }
};


// Page de connexion
export const login = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        
        const user = await User.findOne({email})
        
        if(!user){
            return res.status(404).json({message: "Aucun utilisateur enregistré avec ce mail"})
        }
        
        const isValidPWd = bcrypt.compareSync(password, user.password)
        
        // Si l'utilisateur se trompe de mot de passe
        if(!isValidPWd){
            
            return res.status(401).json({message: "Mot de passe incorrect"})
        }
        
        // req.session.isLogged = true
        // Je vais créer mon token, si le MDP est correcte
        const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION })
        
        // ON RENVOIE TOUT SAUF LE MOT DE PASSE /!\
        res.status(200).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            token // Il faut renvoyer au client le TOKEN
        })
        
    } catch (e) {
        res.status(401).json({message: "Impossible de se connecter"})
        console.log(e)
    }
}

// Changement de mot de passe
export const resetPassword = async (req, res) => {
    try {
        
        const {password} = req.body
        
        if(password.trim() === "") {
            return res.status(400).json({message: "Veuillez entrer un mot de passe"})
        }
        
        
        // PWD: 1 Maj, 1M, 1caractère spé, 1 chiffre,  entre 8 et 55 caractères
        // source: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        const checkPwd = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*.-]).{8,55}$/
          
          // Vérification du MDP respectant la regex
        if(!checkPwd.test(password)){
            return res.status(401).json({message: "Le mot de passe ne respecte pas les conditions"})
        }
        
        // Il ne faut pas oublier de hacher le MDP avant de le resauvegarder
          const salt = await bcrypt.genSalt(10) // 2e10
        const hashedPassword =  await bcrypt.hash(password, salt)
        
        await User.findByIdAndUpdate(req.userId, {password: hashedPassword})
        
        res.status(200).json({message: "Mot de passe changé avec succès"})
        
    } catch (e) {
        console.log(e)
        res.status(401).json({message: "Erreur lors de la modification du mot de passe", error: e})
    }
}

// Permet de vérifier qui est l'utilisateur connecté.
export const checkUser = async (req, res) => {
    try {
        
       // req.userId // Récupérer l'utilisateur qui est connecté ! 
       
       // On ne renvoie pas JAMAIS le mot de passe
       const user = await User.findById(req.userId).select("-password")
            //   const user = await User.findOne({_id: req.userId}).select("-password")
        
        res.status(200).json(user)
        
        
    } catch (e) {
        res.status(400).json({message: "Erreur lors de la vérification"})
    }
}