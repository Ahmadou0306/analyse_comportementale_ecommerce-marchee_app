# marche-app — Application E-commerce (générateur de données)

Application e-commerce full-stack utilisée comme source de logs pour la pipeline d'observabilité.

## Architecture

```
marche-app/
├── backend/        # API REST Express.js + PostgreSQL (port 5000)
├── frontend/       # SPA React + Vite (port 5173)
├── docker-compose.yml          # backend + frontend + db + filebeat intégré
└── docker-compose-filebeat.yml # filebeat seul (si app déjà lancée)
```

**Filebeat** est embarqué dans le `docker-compose.yml` principal. Il détecte les conteneurs via le label `filebeat_topic` et envoie les logs vers le topic Kafka correspondant.

| Conteneur | Label `filebeat_topic` | Topic Kafka |
|---|---|---|
| `marche_backend` | `backend-logs` | `backend-logs` |
| `marche_frontend` | `frontend-logs` | `frontend-logs` |

## Prérequis

- Networks Docker créés : `kafka-net`
- Stack Kafka démarrée

## Installation

```bash
# 1. Lancer l'app + filebeat
docker compose up --build -d

# 2. Initialiser la base de données (premier lancement uniquement)
docker exec marche_backend npx prisma migrate deploy
docker exec marche_backend npx prisma db seed
```

## Ports

| Service    | Port |
|------------|------|
| Frontend   | 5173 |
| Backend    | 5000 |
| PostgreSQL | 5432 |

## Accès admin

- Indicatif : `+221` — Téléphone : `810000000` — OTP : `123456`
