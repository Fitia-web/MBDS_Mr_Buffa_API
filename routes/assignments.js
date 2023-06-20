let Assignment = require('../model/assignment');

function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate();
    Assignment.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
   }
   

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    Assignment.findOne({_id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = (req.body.note != null ) ? true : false;
    assignment.auteur = req.body.auteur;
    assignment.matiere = req.body.matiere;
    assignment.note = req.body.note;
    assignment.remarque = req.body.remarque;
    assignment.image = req.body.image;

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    if(req.body.note != null || req.body.note != ""){
        req.body.rendu = true;
    }
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send("pas ok")
        } else {
          res.json({message: `assignment Rendu !`})
        }
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}

async function getAssignmentNew(req, res) {
    let rendu = req.body.rendu;
    let page = req.body.page;
    let limit = req.body.limit;
    var aggregateQuery = Assignment.aggregate([{"$match" : {
        "rendu" : rendu
        }}]);
    let assignments = await Assignment.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        });
    return res.json({assignments : assignments});
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, getAssignmentNew };
