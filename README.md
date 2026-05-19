\# HAPI FHIR Observabilité — Projet DevOps ENSIAS 2026



> Étude expérimentale de l'impact de l'observabilité sur la détection et la résolution 

> d'incidents dans un serveur de santé FHIR.  

> \*\*Stack\*\* : HAPI FHIR · Prometheus · Grafana · Loki · Tempo · k6  

> \*\*Soutenance\*\* : 5 Mars 2026



\*\*Filière\*\* : D2S — Data \& Software Science, 2ème année · ENSIAS



\---



\## 🎯 Objectif du projet



Mesurer quantitativement comment l'observabilité influence la capacité d'une équipe DevOps 

à détecter et résoudre des incidents en production, en utilisant un serveur de santé FHIR 

(HAPI FHIR) comme cas d'usage réel.



Deux indicateurs clés sont mesurés :

\- \*\*MTTD\*\* (Mean Time To Detect) — temps moyen pour détecter un incident

\- \*\*MTTR\*\* (Mean Time To Resolve) — temps moyen pour le résoudre



\---



\## 🧪 Méthodologie expérimentale



\### 4 niveaux d'observabilité comparés



| Niveau | Logs | Métriques | Traces | Stack technique             |

|--------|------|-----------|--------|-----------------------------|

| 0      | ❌   | ❌        | ❌     | Aucun outil                 |

| 1      | ✅   | ❌        | ❌     | Loki + Promtail + Grafana   |

| 2      | ✅   | ✅        | ❌     | + Prometheus                |

| 3      | ✅   | ✅        | ✅     | + Tempo (stack complète)    |



\### 6 scénarios d'incidents injectés



| #  | Incident              | Méthode d'injection                            |

|----|-----------------------|------------------------------------------------|

| 1  | Base de données down  | `docker compose stop hapi-fhir-postgres`       |

| 2  | Surcharge CPU         | `k6 run surcharge\_cpu.js` (1000 req/sec)       |

| 3  | Fuite mémoire         | Limite conteneur à 256 Mo                      |

| 4  | Latence réseau        | `tc netem` — délai artificiel de 2s            |

| 5  | Erreurs 500           | `k6 run erreurs500.js`                         |

| 6  | Disque plein          | Remplissage du volume                          |



\*\*Total : 4 × 6 = 24 expériences mesurées.\*\*



\---



\## 🚀 Lancement rapide



\### Prérequis

\- Docker Desktop installé et démarré

\- Git

\- (Optionnel) k6 pour les tests de charge



\### Installation



```bash

git clone https://github.com/Sabbarso/Devops-hapi-fhir-observabilite.git

cd Devops-hapi-fhir-observabilite

```



\### Lancer un niveau d'observabilité



```bash

\# Niveau 0 — Application seule

docker compose up hapi-fhir hapi-fhir-postgres -d



\# Niveau 1 — Logs uniquement

docker compose --profile logs up -d



\# Niveau 2 — Logs + Métriques

docker compose --profile logs --profile metrics up -d



\# Niveau 3 — Observabilité complète

docker compose --profile logs --profile metrics --profile traces up -d

```



\---



\## 🔗 Accès aux interfaces



| Service     | URL                                       | Identifiants  |

|-------------|-------------------------------------------|---------------|

| HAPI FHIR   | http://localhost:8080/fhir/metadata       | —             |

| Grafana     | http://localhost:3000                     | admin / admin |

| Prometheus  | http://localhost:9090                     | —             |

| Loki        | http://localhost:3100                     | —             |



\---



\## 📋 Protocole expérimental



Pour chaque combinaison `(niveau, incident)` :



1\. Lancer le niveau d'observabilité

2\. Attendre 1 minute (stabilisation)

3\. Noter \*\*T0\*\* → injecter l'incident

4\. Détecter via Grafana/logs/traces → noter \*\*T1\*\*

5\. Résoudre → noter \*\*T2\*\*

6\. Calculer \*\*MTTD = T1 − T0\*\* et \*\*MTTR = T2 − T0\*\*

7\. `docker compose down -v` → recommencer



\---



\## 📊 Résultats



Les mesures brutes sont consolidées dans `results/experiments.xlsx`, et les graphes comparatifs sont générés via :



```bash

python analyze\_results.py

```



\---



\## 🛠️ Commandes utiles



```bash

docker compose up -d        # Lancer tout

docker compose stop         # Arrêter (conserve les données)

docker compose down         # Arrêter + supprimer conteneurs

docker compose down -v      # Tout supprimer (conteneurs + volumes)

docker compose logs -f      # Logs en direct

docker ps                   # Conteneurs actifs

```



\---



\## 📚 Concepts clés



| Terme              | Définition                                                              |

|--------------------|-------------------------------------------------------------------------|

| MTTD               | Mean Time To Detect — temps moyen pour détecter un incident             |

| MTTR               | Mean Time To Resolve — temps moyen pour le résoudre                     |

| FHIR               | Standard international d'échange de données de santé (HL7)              |

| Observabilité      | Capacité à comprendre l'état interne via logs, métriques, traces        |

| Chaos Engineering  | Injection volontaire de pannes pour tester la résilience                |



\---



\## 🔧 Stack technique



\*\*Application\*\* : HAPI FHIR JPA Server (Java, Spring Boot) · PostgreSQL  

\*\*Observabilité\*\* : Prometheus · Grafana · Loki · Promtail · Tempo  

\*\*Chaos \& charge\*\* : k6 · `tc netem` · scripts Bash  

\*\*Conteneurisation\*\* : Docker · Docker Compose (profils)  

\*\*Analyse\*\* : Python · Pandas · Matplotlib



\---



\## 📖 Références



\- HAPI FHIR — https://hapifhir.io/

\- Prometheus — https://prometheus.io/docs/

\- Grafana — https://grafana.com/docs/

\- Loki — https://grafana.com/docs/loki/

\- Tempo — https://grafana.com/docs/tempo/

\- k6 — https://k6.io/docs/



\---



\## 📄 Licence



Projet académique basé sur \[HAPI FHIR JPA Server Starter](https://github.com/hapifhir/hapi-fhir-jpaserver-starter) (Apache 2.0).



\---



\*\*ENSIAS — Université Mohammed V de Rabat — 2025/2026\*\*

