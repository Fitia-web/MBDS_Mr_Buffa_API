let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let UtilisateurSchema = Schema({
    nom:String,
    pseudo:String,
    mdp:String,
    isAdmin :Boolean,
    image :String
});

// Pour ajouter la pagination
UtilisateurSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('utilisateurs', UtilisateurSchema);
