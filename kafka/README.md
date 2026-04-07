# kafka - Cluster de streaming

Cluster Kafka en mode **KRaft** (sans Zookeeper) utilisé comme buffer de streaming entre Filebeat et Logstash.

---

## Rôle dans la pipeline

Kafka découple les producteurs (Filebeat) des consommateurs (Logstash). Si Logstash est lent ou redémarre, les messages ne sont pas perdus - ils attendent dans le topic jusqu'à être consommés.

```
Filebeat  ->  Kafka (topics)  ->  Logstash  ->  Elasticsearch
 (push)        (buffer)           (pull)
```

---

## KRaft - Kafka sans Zookeeper

Le mode **KRaft** remplace Zookeeper par un consensus interne basé sur le protocole **Raft**. Les métadonnées du cluster (liste des topics, partitions, leaders) sont gérées directement par des nœuds dédiés appelés **controllers**.

```
3 Controllers  ->  quorum Raft, gestion des métadonnées, élection des leaders
3 Brokers      ->  réception, stockage et distribution des messages
```

Les controllers ne reçoivent jamais de messages applicatifs - ils gèrent uniquement l'état du cluster. Le quorum à 3 tolère la perte d'un controller sans interruption de service.

---

## Brokers - Stockage et distribution

Les 3 brokers reçoivent les messages des producteurs et les servent aux consommateurs.

### Partitions et réplication

Chaque topic est découpé en **partitions** distribuées sur les brokers. Chaque partition a un **leader** (écritures/lectures) et des **replicas** (copies de secours).

```
Topic "backend-logs" - 6 partitions, réplication 3
├── Partition 0  ->  leader: broker-1,  replicas: broker-2, broker-3
├── Partition 1  ->  leader: broker-2,  replicas: broker-1, broker-3
├── Partition 2  ->  leader: broker-3,  replicas: broker-1, broker-2
└── ...
```

**Paramètres configurés :**

| Paramètre | Valeur | Signification |
|---|---|---|
| `replication.factor` | 3 | Chaque message existe sur les 3 brokers |
| `min.insync.replicas` | 2 | Au moins 2 brokers doivent confirmer l'écriture |
| `num.partitions` | 6 | Parallélisme par défaut |
| Rétention | 7 jours / 1 GB | Messages conservés même après consommation |

La rétention permet à Logstash de **rejouer** les messages depuis le début en cas de problème (`auto_offset_reset: earliest`).

---

## Services

```
3 Controllers  ->  quorum KRaft, élection des leaders de partition
3 Brokers      ->  stockage des messages, ports 29092 / 39092 / 49092
kafka-init     ->  création automatique des topics au démarrage (attend 15s)
kafka-ui       ->  interface graphique (port 8080)
filebeat-kafka ->  collecte les logs des brokers -> envoi direct vers Elasticsearch
```

### Topics créés automatiquement

| Topic | Partitions | Réplication | Source |
|---|---|---|---|
| `backend-logs` | 6 | 3 | Filebeat app (backend) |
| `frontend-logs` | 3 | 3 | Filebeat app (frontend) |
| `postgres-logs` | 3 | 3 | Filebeat app (PostgreSQL) |
| `transactions` | 3 | 3 | Réservé |
| `metrics` | 3 | 3 | Réservé |

`backend-logs` a 6 partitions car c'est le topic le plus sollicité (tous les appels HTTP + événements panier).

---

## Prérequis

- Networks Docker créés : `kafka-net`, `elk-net`
- Fichier `.env` avec `KAFKA_UI_USER`, `KAFKA_UI_PASSWORD`, `ELASTIC_PASSWORD`, `STACK_VERSION`

## Installation

```bash
docker compose up -d
```

`kafka-init` attend 15 secondes que les brokers soient prêts, puis crée les topics.

---

## Accès

### Kafka UI

Interface graphique pour visualiser les topics, partitions, consommateurs et messages.

Accessible sur `http://localhost:8080`

| Champ | Valeur par défaut |
|---|---|
| Utilisateur | `kafka` |
| Mot de passe | `kafka` |

### Brokers (accès hôte)

| Broker | Port hôte |
|---|---|
| broker-1 | `29092` |
| broker-2 | `39092` |
| broker-3 | `49092` |
