const express = require('express'); //permet d'utiliser gerer les routes en utilisant les requetes sql post dans notre cas ici
const cors = require('cors'); // permet d'autoriser les requetes http(entre le methode get dans le backend et le fetch dans le front)
const mysql = require('mysql2');
const bcrypt = require('bcryptjs')
const app = express(); //declaration d'une variable app en l'autorisant à utiliser express()
// la variable db declarer ci-dessous permet de creer la connexion entre le backend(index.js) et la base de donnée dans phpmyadmin
// ✅ Connexion MySQL configurable via variables d'environnement Railway
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // hôte Railway ou fallback localhost
  user: process.env.DB_USER || 'root',       // utilisateur Railway ou fallback root
  password: process.env.DB_PASSWORD || '',   // mot de passe Railway ou fallback vide
  database: process.env.DB_NAME || 'odc',    // nom BDD Railway ou fallback local
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306  // port Railway ou fallback 3306
});


// Cette partie permet de verifier si la connexion au serveur à reussi(backend et phpmyadmin)
db.connect((err)=>{
    if(err){
        console.log('erreur lors de la connexion',err.message)
        return;
    }
    console.log('connexion à odc reussi')
})

app.use(cors());//permet à la variable app d'utiliser cors pour les requetes http
app.use(express.json())// app demande à express de pouvoir parser les valeurs en json() puisque de base il recevra un string depuis le frontend


// -----------------------------------------Inscription------------------------------------------------

app.post('/user/register', (req,res)=>{//ici app.post prend deux parametres, le chemin utliser dans le fetch depuis le front, et un parenthese contenant deux variables
    const user = req.body;//ici req(request) prend les valeurs depuis le body du frontend en faisant req.body et le stock dans la variable user
    console.log("Utilisateur reçu :", user);//message a afficher dans la console si le backend arrive à recuperer les valeurs
//la condition ci-dessous permet de verifier si tout les champs contiennent quelques choses avant que le backend réçoivent(champ non vide)
    if(!user.nom || !user.prenom || !user.email || !user.password)
            {
            console.log('Champ vide detecté');
            return res.status(400).json({message:"erreur d'enregistrement"})
        } 
    const sqlcheck = 'SELECT * FROM utilisateurs WHERE email = ?';
    db.query(sqlcheck, [user.email], (err, result)=>{
        if(err){
            console.log('erreur lors de la verification', err)
            return res.status(500).json({message: "Erreur serveur"})
        }

        if(result.length > 0){
            return res.status(409).json({message: 'email deja existant'})
        }

           // à noter que le mot(utilisateurs) est le nom de la table dans la quelle les valeurs seront inserer
        //ta base de donnée doit au moins contenir une table ayant le meme nom et cest elle qui va l'a recuperer
    const sqlinsert = 'INSERT INTO utilisateurs(nom, prenom, email, password) VALUES (?,?,?,?)';//la requete sql à executer pour envoyer les données au serveur
    const values = [user.nom, user.prenom, user.email, bcrypt.hashSync(user.password, 10)];//les valeurs à envoyer(rappel: user du req.body)
        // console.log("Requête SQL envoyée avec :", values);
        //db.query(param1, param2, param3(fonction)) prend trois elements: la requete sql, les valeurs et la fonction qui sera executer quand tout se passe bien ou en cas d'echec
    db.query(sqlinsert, values, (err, result)=>{
         if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).json({ message: "Erreur MySQL" });
    }

    console.log(" Utilisateur inséré !");
    console.log(result)
    res.status(201).json({ message: 'Vous avez été enregistré avec succès !' });
    })
    })   
   
})

//----------------------------------login-----------------------------------------

app.post('/user/login', (req, res)=>{
    const {email, password} = req.body;
    const sql = 'SELECT * FROM utilisateurs WHERE email = ?';
    db.query(sql, [email], (err, result)=>{
        if(err){
            res.status(500).json({message:'Erreur serveur'})
        }
        if(result.length === 0){
            return res.status(401).json({message: 'Utilisateur introuvable'})
        }
        const user = result[0];
        const realPassword = bcrypt.compareSync(password, user.password)
        if(!realPassword){
            return res.status(401).json({message:'mot de pass incorect'})
        }
        res.status(200).json({message: 'connexion reussi', 
            user: {
                id: result[0].id,
                nom: result[0].nom,
                prenom: result[0].prenom,
                email: result[0].email,
                role: result[0].role
            }
        });
    })
})
//-------------------------------------------rechercheVols---------------------------------------

app.post('/recherche/vols', (req, res)=>{
    const searchItem = req.body;
    const {ville_depart, ville_destination, date_depart} = searchItem;
    console.log('Element de recherche', searchItem)
    const sql = 'SELECT * FROM vols WHERE ville_depart = ? AND ville_destination = ? AND date_depart = ?';
    db.query(sql, [ville_depart, ville_destination, date_depart], (err, result)=>{
        if(err){
            res.status(500).json({message: 'Erreur serveur'});
        }
        if(result.length === 0){
            return res.status(404).json({message: 'Aucun vol trouvé pour ces informations'})
        }
        res.status(200).json(result)
    })
})

//----------------------------------Vols disponibles-------------------------------------------

app.get('/volsDisponibles', (req,res)=>{
    const sql = `SELECT * FROM vols ORDER BY date_depart DESC LIMIT 6`;
    db.query(sql, (err, result) => {
        if(err){
            console.log("erreur d'affichage des vols à la une");
            res.status(500).json({message: 'Erreur de recuperation des vols a afficher'})
        }
        res.status(200).json(result);

    })
})

//--------------------------------------------recuperation_vol(responseDeuseEffect)----------------------------
app.get('/vols/:id', (req, res)=>{
    const id = req.params.id;
    const sql ='SELECT * FROM vols WHERE id = ?';
    db.query(sql, [id], (err, result)=>{
        if(err){
            return res.status(500).json({message: 'Erreur lors de la recuperation du vol'})
        }
        if(result.length === 0){
            return res.status(404).json({message: 'Vol introuvable'});
        }
        res.status(200).json(result[0])
    })
})

//------------------------------------------insertion de la reservation &miseAJour du nb_places-------------------------------
app.post('/reservation', (req, res) => {
  const { utilisateur_id, vol_id, numeroCarte, expiration, cvv } = req.body;

  // REGEX
  const regExpNumeroCarte = /^\d{16}$/;
  const regExpExpiration = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const regExpCvv = /^\d{3,4}$/;

  if (!regExpNumeroCarte.test(numeroCarte)) {
    return res.status(400).json({ message: 'Numero de carte invalide' });
  }
  if (!regExpExpiration.test(expiration)) {
    return res.status(400).json({ message: "Date d'expiration invalide" });
  }
  if (!regExpCvv.test(cvv)) {
    return res.status(400).json({ message: 'CVV invalide' });
  }

  const sqlCheck = 'SELECT * FROM vols WHERE id = ? AND nb_places > 0';
  const sqlinsert = 'INSERT INTO reservations(id_utilisateurs, id_vols, date_reservations) VALUES (?, ?, NOW())';
  const sqlUpdate = 'UPDATE vols SET nb_places = nb_places - 1 WHERE id = ? AND nb_places > 0';

  db.query(sqlCheck, [vol_id], (err, result) => {
    if (err) {
      console.log('Erreur de vérification', err);
      return res.status(500).json({ message: 'Erreur lors de la vérification' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Vol indisponible ou plus de place disponible' });
    }

   
    db.query(sqlinsert, [utilisateur_id, vol_id], (err1, result1) => {
      if (err1) {
        console.log('Erreur de reservation', err1);
        return res.status(500).json({ message: 'Erreur serveur lors de la réservation' });
      }


      db.query(sqlUpdate, [vol_id], (err2, result2) => {
        if (err2) {
          console.log('Erreur lors de la mise à jour', err2);
          return res.status(500).json({ message: 'Enregistrement réussi mais erreur mise à jour' });
        }

        return res.status(200).json({ message: 'Réservation effectuée avec succès' });
      });
    });
  });
});



//---------------------------------------------historique de l'utilisateur---------------------------------------
app.post('/mes-reservation', (req, res)=>{
    const {utilisateur_id} = req.body; 
    console.log('Body reçu :', req.body); 
     if (!utilisateur_id) {
    return res.status(400).json({ message: "ID utilisateur manquant" });
  }
    const sql ='SELECT r.id AS reservation_id, v.* FROM reservations r JOIN vols v ON r.id_vols = v.id WHERE r.id_utilisateurs = ?';
    db.query(sql, [utilisateur_id], (err, result)=>{
        if(err){
            console.log('Erreur lors du chargement')
            return res.status(500).json({message: 'Erreur serveur'})
        }
        if(result.length === 0){
            return res.status(404).json({message:'Vous n\'avez pas encore fait de reservation'})
        }
        res.status(200).json(result);
    })
})
//-----------------------------------------Tous les historique de reservation coté admin-------------------------------

app.get('/les-reservations', (req, res) => {
  const sql = `
    SELECT 
      r.id AS reservation_id, 
      r.date_reservations, 
      u.nom AS nom_utilisateur,
      u.prenom AS prenom_utilisateur,
      u.email, 
      v.ville_depart,
      v.ville_destination,
      v.date_depart, 
      v.heure_depart,
      v.compagnie,
      v.classe, 
      v.prix 
    FROM reservations r 
    JOIN utilisateurs u ON r.id_utilisateurs = u.id 
    JOIN vols v ON r.id_vols = v.id 
    ORDER BY r.date_reservations DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors du chargement :", err);
      return res.status(500).json({ message: "Erreur lors du chargement des réservations" });
    }
      res.status(200).json(result);
  });
});


//----------------------------------------Recuperation de la liste des vols---------------------------------------------------
app.get('/vols', (req,res)=>{
    const sql = 'SELECT * FROM vols';
    db.query(sql, (err, result)=>{
        if(err){
            return res.status(500).json({message:'Erreur serveur'})
        }
        res.status(200).json(result)
    });
});

//-------------------------------------------l'ajout des vols--------------------------------------------------------
app.post('/ajout-vol', (req, res) => {
    const vol = req.body; // ✅ on récupère les données envoyées par le front

    const sql = `
        INSERT INTO vols (
            ville_depart, ville_destination, date_depart,
            heure_depart, compagnie, classe, prix, image, nb_places
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        vol.ville_depart,
        vol.ville_destination,
        vol.date_depart,
        vol.heure_depart,
        vol.compagnie,
        vol.classe,
        vol.prix,
        vol.image,
        vol.nb_places
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout du vol :", err);
            return res.status(500).json({ message: "Erreur d'enregistrement" });
        }
        res.status(201).json({ message: "Vol ajouté avec succès" });
    });
});


//-------------------------------------------dashboard---------------------------------------------------------
app.get('/admin/dashboard', (req, res) => {
    const stats = {
        totalUtilisateurs: 0,
        totalVols: 0,
        totalReservations: 0,
        placesDisponibles: 0
    };

    const sql1 = 'SELECT COUNT(*) AS total FROM utilisateurs';
    const sql2 = 'SELECT COUNT(*) AS total FROM vols';
    const sql3 = 'SELECT COUNT(*) AS total FROM reservations';
    const sql4 = 'SELECT SUM(nb_places) AS total FROM vols';

    db.query(sql1, (err1, res1) => {
        if (err1) return res.status(500).json({ message: "Erreur utilisateurs" });
        stats.totalUtilisateurs = res1[0].total;

        db.query(sql2, (err2, res2) => {
            if (err2) return res.status(500).json({ message: "Erreur vols" });
            stats.totalVols = res2[0].total;

            db.query(sql3, (err3, res3) => {
                if (err3) return res.status(500).json({ message: "Erreur réservations" });
                stats.totalReservations = res3[0].total;

                db.query(sql4, (err4, res4) => {
                    if (err4) return res.status(500).json({ message: "Erreur places" });
                    stats.placesDisponibles = res4[0].total || 0;

                    res.status(200).json(stats);
                });
            });
        });
    });
});
//-----------------------------------------Graphique-------------------------------------------------
app.get('/admin/stats-reservations-par-vol', (req, res) => {
 const sql = `
  SELECT CONCAT(v.ville_depart, ' → ', v.ville_destination) AS trajet,
         COUNT(r.id) AS total
  FROM reservations r
  JOIN vols v ON r.id_vols = v.id
  GROUP BY trajet
  ORDER BY total DESC
`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur SQL', err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.status(200).json(results);
  });
});


//-------------------------------------------supprimer un vol-----------------
app.delete('/vols/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM vols WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vol non trouvé' });
    }

    res.status(200).json({ message: 'Vol supprimé avec succès' });
  });
});
//--------------------------------------modifier------------
app.put('/vols/:id', (req, res) => {
  const id = req.params.id;
  const { ville_depart, ville_destination, date_depart, heure_depart, compagnie, classe, prix, image, nb_places } = req.body;
  const sql = `UPDATE vols SET ville_depart=?, ville_destination=?, date_depart=?, heure_depart=?, compagnie=?, classe=?, prix=?, image=?, nb_places=? WHERE id=?`;
  const values = [ville_depart, ville_destination, date_depart, heure_depart, compagnie, classe, prix, image, nb_places, id];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la modification' });
    res.status(200).json({ message: 'Vol modifié avec succès' });
  });
});














app.listen(9100, ()=>console.log('api en cours'))//app.listen permet d'ecouter l'evenement de soumission(le plus souvent placé à la derniere ligne du code)