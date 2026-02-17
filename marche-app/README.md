# Saferoute - Plateforme E-commerce

Application e-commerce full-stack avec analyse comportementale via la stack ELK.

---

## Architecture du projet

```
marche-app/
├── backend/                    # API REST Express.js
│   ├── src/
│   │   ├── server.js           # Point d'entrée
│   │   ├── middleware/
│   │   │   └── auth.js         # Middleware JWT
│   │   ├── routes/
│   │   │   ├── auth.js         # Authentification OTP par téléphone
│   │   │   ├── products.js     # CRUD produits
│   │   │   ├── categories.js   # CRUD catégories
│   │   │   ├── orders.js       # Gestion commandes
│   │   │   └── admin.js        # Routes admin
│   │   ├── utils/
│   │   │   └── otp.js          # Génération codes OTP
│   │   ├── lib/
│   │   │   └── prisma.js       # Client Prisma
│   │   └── swagger.js          # Documentation API
│   ├── prisma/
│   │   ├── schema.prisma       # Modèles BDD (User, Product, Category, Order)
│   │   └── seed.js             # Données initiales
│   ├── images/                 # Uploads images produits
│   ├── dockerfile
│   └── docker-compose.yml      # PostgreSQL + Backend
│
└── frontend/                   # SPA React + Vite
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Admin/          # Layout, Modal, Sidebar admin
    │   │   ├── Auth/           # Modal connexion OTP
    │   │   ├── Cart/           # Panier latéral
    │   │   ├── Layout/         # Header, Footer, CategoryNav
    │   │   ├── Product/        # Carte produit
    │   │   └── UI/             # Toast notifications
    │   ├── context/
    │   │   ├── AdminContext.jsx
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Catalog.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Success.jsx
    │   │   ├── Profile.jsx
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminCategories.jsx
    │   │       └── AdminOrders.jsx
    │   └── utils/
    │       ├── api.js           # Appels HTTP vers le backend
    │       └── categoryIcons.jsx # Mapping slug -> icone
    ├── dockerfile
    └── docker-compose.yml       # Frontend Vite dev server
```

### Stack technique

- **Frontend** : React 19, Vite, React Router, React Icons
- **Backend** : Node.js, Express 4, Prisma ORM
- **Base de donnees** : PostgreSQL 15
- **Auth** : JWT + OTP par numero de telephone
- **Documentation API** : Swagger UI (`/api-docs`)

---

## Lancement avec Docker (recommande)

### 1. Lancer le backend + base de donnees

```bash
cd backend
docker compose up -d
```

Appliquer les migrations et le seed initial :

```bash
docker exec marche_backend npx prisma migrate deploy
docker exec marche_backend npx prisma db seed
```

L'API est disponible sur `http://localhost:5000`
La documentation Swagger est sur `http://localhost:5000/api-docs`

### 2. Lancer le frontend

```bash
cd frontend
docker compose up -d
```

L'application est disponible sur `http://localhost:5173`

---

## Lancement sans Docker (developpement local)

### Prerequisites

- Node.js 20+
- PostgreSQL 15 en cours d'execution

### Backend

```bash
cd backend
npm install
```

Creer un fichier `.env` :

```env
DATABASE_URL=postgresql://postgres:passer@localhost:5432/marche_db
JWT_SECRET=ma-cle-secrete
OTP_DEFAULT_CODE=123456
ADMIN_PHONE=810000000
ADMIN_COUNTRY_CODE=+221
PORT=5000
```

Initialiser la base de donnees :

```bash
npm run db:migrate
npm run db:seed
```

Demarrer le serveur (mode developpement avec rechargement auto) :

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Commandes utiles

### Backend

| Commande            | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Serveur de developpement (node --watch)  |
| `npm run start`     | Serveur de production                    |
| `npm run db:migrate`| Appliquer les migrations Prisma          |
| `npm run db:seed`   | Injecter les donnees initiales           |
| `npm run db:reset`  | Reinitialiser la base de donnees         |

### Frontend

| Commande          | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Serveur de developpement Vite        |
| `npm run build`   | Build de production (dossier dist/)  |
| `npm run preview` | Previsualiser le build de production |

---

## Ports par defaut

| Service    | Port |
|------------|------|
| Frontend   | 5173 |
| Backend    | 5000 |
| PostgreSQL | 5432 |

---

## Acces admin

Le compte administrateur est cree automatiquement lors du seed.
Par defaut (configurable via variables d'environnement) :

- Indicatif : `+221`
- Telephone : `810000000`
- Code OTP : `123456`
