
# Reservation Billet Project

Ce projet est une application web complète pour la réservation de billets d’avion.  
Elle permet à un utilisateur de rechercher, réserver et gérer ses vols, et à un administrateur de gérer les vols et consulter les statistiques.

---

## Fonctionnalités principales

- Recherche de vols disponibles
- Réservation avec vérification des informations bancaires (Regex)
- Gestion des vols (ajout, modification, suppression) par l’administrateur
- Dashboard admin avec statistiques et graphique (Recharts)
- Authentification des utilisateurs
- Redirection intelligente après connexion

---

## Technologies utilisées

- Frontend : React, Bootstrap
- Backend : Node.js, Express
- Base de données : MySQL
- Librairie graphique : Recharts
- Autres : Regex pour validation, LocalStorage pour persistance, Context/State pour transfert des données

---

## Structure du projet

reservation_project/
├── rb_frontend/   # Application React
├── rb_backend/    # Serveur Node.js & Express
└── README.md

---

## Configuration locale

### Cloner le projet

git clone https://github.com/Kanissthebest/reservation_project.git
cd reservation_project

---

### Installer les dépendances

# Frontend
cd rb_frontend
npm install

# Backend
cd ../rb_backend
npm install

---

### Configurer les fichiers `.env`

**Backend** (rb_backend/.env)

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepassefort
DB_NAME=reservation_db
PORT=9100

**Frontend** (rb_frontend/.env)

VITE_API_URL=http://localhost:9100

---

### Démarrer le projet

# Lancer le backend
cd rb_backend
npm start

# Lancer le frontend
cd ../rb_frontend
npm run dev

---

## Base de données

La base de données n’est **pas incluse** dans ce repository.

Vous devez la créer localement avec vos propres identifiants MySQL ou MariaDB.  
Pensez à protéger vos identifiants en utilisant des variables d’environnement.

---

## Auteurs

Projet réalisé par :
- Issa Kane
- Thierno Ibrahime Diallo
- Emmanuel Lamah
- Mamadou Lamarana Baldé

---

## Contact

+224 629345423
