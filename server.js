let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let utilisateur = require('./routes/utilisateur');
let matiere = require('./routes/matiere');
let mongoose = require('mongoose');
let Assignment = require('./model/assignment');
let Utilisateur = require('./model/utilisateur');

mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://fitia:fitia@cluster.pvbexrc.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

const cors = require('cors');

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({limit : '50mb',extended: true}));
app.use(bodyParser.json({limit : '50mb'}));

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';


app.use(cors())

app.route(prefix + '/getAssignments')
    .post(assignment.getAssignmentNew);


app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment)

//Route a propos des utilisateurs
app.route(prefix + '/utilisateur/login')
    .post(utilisateur.login);

app.route(prefix + '/utilisateur')
    .post(utilisateur.insert)
    .get(utilisateur.liste)
    .put(utilisateur.update)


app.route(prefix+'/utilisateur/:id')
    .get(utilisateur.getUtilisateur)
    .delete(utilisateur.remove);

//recherche utilisateur
app.route(prefix+'/recherche/:table')
    .post(async function recherche(req,res){
        let table = req.params.table;
        if(table == "utilisateurs") {
            let users = await Utilisateur.find(req.body).exec();
            return res.json({users : users});
        }
        else if(table == "assignments") {
            let assignments = await Assignment.find(req.body).exec();
            return res.json({assignments : assignments});
        }
    });

//route Matiere
app.route(prefix+'/matiere/:matiere')
    .get(matiere.getMatiere);
app.route(prefix+'/matiere/')
    .post(matiere.insert);
app.route(prefix+'/matieres/')
    .post(matiere.getMatieres);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


