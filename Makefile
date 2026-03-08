ENV_FILE := --env-file .env

# ─────────────────────────────────────────────
# Application MARCHÉ (frontend + backend + db + filebeat)
# ─────────────────────────────────────────────
up-app:
	docker compose $(ENV_FILE) -f marche-app/docker-compose.yml up --build -d

down-app:
	docker compose $(ENV_FILE) -f marche-app/docker-compose.yml down -v

logs-app:
	docker compose $(ENV_FILE) -f marche-app/docker-compose.yml logs -f

build-app:
	docker compose $(ENV_FILE) -f marche-app/docker-compose.yml build

# ─────────────────────────────────────────────
# Filebeat app (séparé)
# ─────────────────────────────────────────────
up-app-filebeat:
	docker compose $(ENV_FILE) -f marche-app/docker-compose-filebeat.yml up --build -d

down-app-filebeat:
	docker compose $(ENV_FILE) -f marche-app/docker-compose-filebeat.yml down -v

logs-app-filebeat:
	docker compose $(ENV_FILE) -f marche-app/docker-compose-filebeat.yml logs -f

# ─────────────────────────────────────────────
# ELK — Stack complète (mutualisé)
# ─────────────────────────────────────────────
up-elk:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose.yml up --build -d

down-elk:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose.yml down -v

logs-elk:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose.yml logs -f

# ─────────────────────────────────────────────
# ELK — Elasticsearch uniquement
# ─────────────────────────────────────────────
up-elk-es:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-elasticsearch.yml up --build -d

down-elk-es:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-elasticsearch.yml down -v

logs-elk-es:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-elasticsearch.yml logs -f

# ─────────────────────────────────────────────
# ELK — Kibana uniquement
# ─────────────────────────────────────────────
up-elk-kibana:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-kibana.yml up --build -d

down-elk-kibana:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-kibana.yml down -v

logs-elk-kibana:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-kibana.yml logs -f

# ─────────────────────────────────────────────
# ELK — Logstash uniquement
# ─────────────────────────────────────────────
up-elk-logstash:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-logstash.yml up --build -d

down-elk-logstash:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-logstash.yml down -v

logs-elk-logstash:
	docker compose $(ENV_FILE) -f elk-compose/docker-compose-logstash.yml logs -f

# ─────────────────────────────────────────────
# Kafka
# ─────────────────────────────────────────────
up-kafka:
	docker compose $(ENV_FILE) -f kafka/docker-compose.yml up --build -d

down-kafka:
	docker compose $(ENV_FILE) -f kafka/docker-compose.yml down -v

logs-kafka:
	docker compose $(ENV_FILE) -f kafka/docker-compose.yml logs -f

# ─────────────────────────────────────────────
# Metricbeat
# ─────────────────────────────────────────────
up-metricbeat:
	docker compose $(ENV_FILE) -f metricbeat/docker-compose.yml up --build -d

down-metricbeat:
	docker compose $(ENV_FILE) -f metricbeat/docker-compose.yml down -v

logs-metricbeat:
	docker compose $(ENV_FILE) -f metricbeat/docker-compose.yml logs -f

# ─────────────────────────────────────────────
# Tout lancer / arrêter
# ─────────────────────────────────────────────
up-all: up-kafka up-elk up-app up-metricbeat

down-all: down-metricbeat down-app down-elk down-kafka

.PHONY: \
	up-app down-app logs-app build-app \
	up-app-filebeat down-app-filebeat logs-app-filebeat \
	up-elk down-elk logs-elk \
	up-elk-es down-elk-es logs-elk-es \
	up-elk-kibana down-elk-kibana logs-elk-kibana \
	up-elk-logstash down-elk-logstash logs-elk-logstash \
	up-kafka down-kafka logs-kafka \
	up-metricbeat down-metricbeat logs-metricbeat \
	up-all down-all
