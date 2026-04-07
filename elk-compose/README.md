# elk-compose - Stack ELK

Stack complète **Elasticsearch + Logstash + Kibana** pour le stockage, le traitement et la visualisation des logs en temps réel.

---

## Rôles dans la stack ELK

### Elasticsearch - Moteur de stockage et de recherche

Base de données orientée documents JSON, optimisée pour la recherche full-text et les agrégations sur de gros volumes de données.  
C'est lui qui stocke tous les logs indexés et répond aux requêtes de Kibana.

### Logstash - Pipeline de traitement

Consomme les messages depuis Kafka, les **parse et transforme** (extraction de champs, typage, enrichissement), puis les envoie vers Elasticsearch.  
Chaque pipeline correspond à un topic Kafka et produit un index ES dédié.

### Kibana - Interface de visualisation

Se connecte à Elasticsearch pour construire des **dashboards temps réel** : graphiques, tableaux, métriques, alertes.  
C'est le point d'entrée pour l'analyse comportementale et le monitoring infrastructure.

---

## Cluster Elasticsearch - Principe des 3 nœuds

Les 3 nœuds (`es01`, `es02`, `es03`) forment un **cluster haute disponibilité**.

```
        ┌─────────────────────────────────────────────┐
        │              Cluster es-cluster             │
        │                                             │
        │   es01 (master)   es02 (master)   es03      │
        │       │               │               │     │
        │       └───────────────┴───────────────┘     │
        │              réplication des shards         │
        └─────────────────────────────────────────────┘
```

Chaque nœud est **master eligible** et **data node** simultanément :
- Un seul nœud est élu **master actif** - il gère les métadonnées du cluster (quels shards sont où, état du cluster)
- Les deux autres sont en **standby** : si le master tombe, une nouvelle élection a lieu automatiquement
- Les **données** sont réparties et répliquées sur les 3 nœuds

### Shards et réplication

Un index ES est découpé en **shards** (fragments). Chaque shard a des copies appelées **replicas**.

```
Index "logstash-backend-*"
├── Shard 0  ->  primaire sur es01,  replica sur es02
├── Shard 1  ->  primaire sur es02,  replica sur es03
└── Shard 2  ->  primaire sur es03,  replica sur es01
```

**Avantages :**
- **Tolérance aux pannes** : si un nœud tombe, les replicas prennent le relais sans perte de données
- **Performance en lecture** : Kibana peut interroger les 3 nœuds en parallèle
- **Scalabilité** : les shards se redistribuent automatiquement si un nœud est ajouté

---

## Architecture des services

```
setup          ->  génère les certificats TLS + définit les mots de passe (s'arrête seul)
es01/es02/es03 ->  cluster Elasticsearch 3 noeuds avec TLS (port 9200 sur es01)
logstash       ->  consomme Kafka, parse et indexe dans Elasticsearch
kibana         ->  interface de visualisation (port 5601)
```

### TLS et sécurité

Le service `setup` génère un **CA (Certificate Authority)** au premier démarrage, puis des certificats signés pour chaque nœud ES. Les communications inter-nœuds et HTTP sont chiffrées. Kibana communique avec ES via le compte `kibana_system` (mot de passe séparé de `elastic`).

---

## Pipelines Logstash

| Pipeline | Topic Kafka consommé | Index Elasticsearch | Formats parsés |
|---|---|---|---|
| backend | `backend-logs` | `logstash-backend-*` | `http_request`, `cart_event` |

Les pipelines sont définis dans `pipeline/` et déclarés dans `config/pipelines.yml`.

---

## Prérequis

- Networks Docker créés : `elk-net`, `kafka-net`
- Fichier `.env` avec `STACK_VERSION`, `ELASTIC_PASSWORD`, `KIBANA_PASSWORD`, `ENCRYPTION_KEY`

## Installation

```bash
# Stack complète
docker compose up --build -d

# Ou composants séparément
docker compose -f docker-compose-elasticsearch.yml up -d
docker compose -f docker-compose-logstash.yml up -d
docker compose -f docker-compose-kibana.yml up -d
```

`setup` génère les certificats au premier démarrage puis s'arrête. Les autres services attendent qu'il soit `healthy`.

---

## Accès

| Service       | URL                    | Utilisateur | Mot de passe par défaut |
|---------------|------------------------|-------------|-------------------------|
| Kibana        | http://localhost:5601  | `elastic`   | `passer`                |
| Elasticsearch | https://localhost:9200 | `elastic`   | `passer`                |
