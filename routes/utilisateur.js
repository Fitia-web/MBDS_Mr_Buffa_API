let Utilisateur = require('../model/utilisateur');
let jwt = require("jsonwebtoken");
require('dotenv').config();
const Ajv = require("ajv");
const moment = require("moment");

async function insert(req, res) {
    let pseudo = req.body.pseudo;
    let mdp = req.body.mdp;
    let nom = req.body.nom;
    let image = req.body.image;
    let user = new Utilisateur({
        pseudo: pseudo,
        mdp: mdp,
        nom: nom,
        isAdmin : req.body.isAdmin,
        image : image
    });
    user.save();
    return res.json("insertion ok");
}

async function update(req, res) {
    let user = await Utilisateur.findOneAndUpdate({_id:req.body.id},req.body).exec();
    return res.json("modification ok");
}

async function remove(req, res) {
    let id =  req.params.id;
    let user = await Utilisateur.find({_id:id}).remove().exec();
    return res.json("suppression ok");
}

async function liste(req,res) {
    let users = await Utilisateur.find().exec();
    return res.json({users : users});
}

async function getUtilisateur(req,res) {
    let id = req.params.id;
    let user = await Utilisateur.find({_id:id}).exec();
    return res.json({user : user});
}

async function login(req, res) {
    let pseudo = req.body.pseudo;
    let mdp = req.body.mdp;
    let user = await Utilisateur.findOne({
        pseudo: pseudo,
        mdp: mdp
    }).exec();
    if (user) {
        let session = await moment().add(30, 'minutes');
        let token = await jwt.sign({
            id: user._id.toString(),
            pseudo: user.pseudo,
            deconnectAt: session
        }, 'Test123Test');
        return res.json({
            token : token,
            user : user
        });
    }
    else return res.status(500).send("Login incorrect");
}

function checktoken(req, res, next) {
    let token = req.headers.token;
    //ajv permet de specifier un modele de json
    const ajv = new Ajv({allErrors: true});
    const schema = {
        type: "object",
        properties: {
            id: {type: "string"},
            pseudo: {type: "string"},
            deconnectAt: {type: "string"}
        },
        required: ["id", "pseudo", "deconnectAt"]
    };
    jwt.verify(token,'Test123Test', async function (err, decoded) {
        let validate = ajv.compile(schema);
        let valid = validate(decoded);
        if (valid) {
            req.userConnected = decoded;
            let deconnect = await moment().isAfter(decoded.deconnectAt);
            if(deconnect) return res.status(500).send("token invalide");
            else next();
        } else return res.status(500).send("token invalide")
    });
}


module.exports = {login, checktoken, insert, update, remove, liste,getUtilisateur};