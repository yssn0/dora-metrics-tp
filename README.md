# 🚀 DORA Metrics Dashboard

[![CI-CD Pipeline](https://github.com/yssn0/dora-metrics-tp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yssn0/dora-metrics-tp/actions/workflows/ci-cd.yml)
[![DORA Metrics](https://github.com/yssn0/dora-metrics-tp/actions/workflows/dora-metrics.yml/badge.svg)](https://github.com/yssn0/dora-metrics-tp/actions/workflows/dora-metrics.yml)

> **TP DevOps** – Extraction et visualisation automatisée des métriques DORA depuis GitHub

## 📊 Qu'est-ce que DORA ?

DORA (DevOps Research and Assessment) définit **4 métriques clés** pour mesurer la performance des équipes DevOps :

| Métrique | Description | Question clé |
|----------|-------------|--------------|
| 📦 **Deployment Frequency** | Fréquence de déploiement en production | À quelle fréquence on déploie ? |
| ⏱️ **Lead Time for Changes** | Temps entre commit et production | Combien de temps pour livrer ? |
| ⚠️ **Change Failure Rate** | % de déploiements causant des problèmes | Combien de déploiements cassent ? |
| 🔧 **MTTR** | Temps moyen de restauration après incident | Combien de temps pour réparer ? |

## 🎯 Objectifs du projet

- ✅ Comprendre les 4 métriques DORA
- ✅ Extraire automatiquement les données via **GitHub API**
- ✅ Calculer les métriques en temps réel
- ✅ Visualiser les KPIs dans un **dashboard interactif**
- ✅ Automatiser via **GitHub Actions**

## 🏗️ Architecture

```
dora-metrics-tp/
├── .github/workflows/
│   ├── ci-cd.yml           # Pipeline CI/CD (simule les déploiements)
│   └── dora-metrics.yml    # Collecte automatique des métriques
├── scripts/
│   └── dora-metrics.js     # Script d'extraction via GitHub API
├── src/
│   ├── index.html          # Dashboard KPI
│   └── index.css           # Styles modernes
├── data/
│   └── dora-metrics.json   # Données des métriques (auto-généré)
└── README.md
```

## ⚙️ Fonctionnement

### 1. Pipeline CI/CD
Chaque push sur `main` déclenche un déploiement simulé :
```yaml
- Build → Test → Deploy
```

### 2. Collecte automatique
Le script `dora-metrics.js` interroge l'API GitHub pour :
- 📊 Récupérer les **workflow runs** (déploiements)
- 📊 Analyser les **Pull Requests** (lead time)
- 📊 Calculer le **taux d'échec** et le **MTTR**

### 3. Dashboard KPI
Les métriques sont affichées dans un dashboard moderne avec :
- 🎨 Design glassmorphism
- 📈 Badges de performance (Elite/High/Medium/Low)
- 📱 Responsive design

## 🚀 Demo

Pour voir le dashboard localement :
```bash
# Cloner le repo
git clone https://github.com/yssn0/dora-metrics-tp.git
cd dora-metrics-tp

# Lancer un serveur local
python -m http.server 8080

# Ouvrir http://localhost:8080/src/index.html
```

## 📐 Formules de calcul

```
Deployment Frequency = Déploiements réussis / 7 jours

Lead Time = Date merge - Date création PR

Change Failure Rate = (Échecs / Total déploiements) × 100

MTTR = Moyenne(Temps récupération - Temps incident)
```

## 🏆 Classification DORA

| Performance | Deployment Frequency | Lead Time | CFR | MTTR |
|-------------|---------------------|-----------|-----|------|
| 🥇 Elite | Multiple/jour | < 1 heure | < 5% | < 1 heure |
| 🥈 High | 1/semaine | < 1 jour | < 10% | < 1 jour |
| 🥉 Medium | 1/mois | < 1 semaine | < 15% | < 1 semaine |
| ⚪ Low | < 1/mois | > 1 semaine | > 15% | > 1 semaine |

## 🔧 Configuration

### Secrets GitHub requis
Dans **Settings > Secrets and variables > Actions** :
- `TOKEN_DORA` : Personal Access Token avec scope `repo`

## 📚 Technologies utilisées

- **GitHub Actions** – CI/CD et automatisation
- **GitHub API** – Extraction des données
- **Node.js** – Script de collecte
- **HTML/CSS/JS** – Dashboard frontend

## 👨‍💻 Auteur

Projet réalisé dans le cadre du TP DevOps

---

*Les métriques DORA permettent d'évaluer objectivement la maturité DevOps d'une équipe et d'identifier les axes d'amélioration.*