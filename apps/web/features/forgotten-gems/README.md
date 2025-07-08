# 💎 Forgotten Gems Feature

## Vue d'ensemble

La fonctionnalité "Forgotten Gems" utilise l'analyse comportementale pour identifier des tracks que l'utilisateur a aimées dans le passé mais qu'il n'a pas écoutées récemment. L'algorithme combine plusieurs métriques pour créer un score d'affinité et recommander des redécouvertes personnalisées.

## 🧠 Comment l'algorithme fonctionne

### 1. Collecte des données
- **Période d'analyse** : Examine l'historique d'écoute sur une période configurable (défaut: 365 jours)
- **Données utilisées** : timestamp, durée d'écoute (msPlayed), skips, raisons de fin d'écoute

### 2. Identification des tracks "aimées"

#### **Affinity Score** (Score d'affinité)
```typescript
affinityScore = totalMsPlayed × completionRate × log(totalPlays + 1)
```

#### **Completion Rate** (Taux de completion)
```typescript
completionRate = tracksComplètes / totalPlays
```
- Exclut les tracks skippées et celles arrêtées prématurément

#### **Repeat Behavior** (Comportement de répétition)
- Détecte les patterns d'écoute répétée dans des fenêtres de 24h
- Score basé sur la fréquence de répétition

### 3. Identification des tracks "oubliées"

#### **Critères temporels**
- **minDaysSinceLastPlayed** (90 jours par défaut) : délai minimum depuis la dernière écoute
- **maxDaysSinceLastPlayed** (730 jours par défaut) : délai maximum pour éviter les tracks trop anciennes

#### **Peak Period Analysis**
- Identifie les périodes de forte écoute (fenêtres de 30 jours)
- Score basé sur l'intensité d'écoute pendant la période de pic

### 4. Filtrage qualité

Les tracks doivent passer plusieurs seuils :
- **minTotalPlays** : nombre minimum d'écoutes (défaut: 3)
- **minCompletionRate** : taux minimum de completion (défaut: 70%)
- **minAffinityScore** : score d'affinité minimum (défaut: 100,000ms)

### 5. Catégorisation des recommandations

| Raison | Description | Critères |
|--------|-------------|-----------|
| `high_completion` | Taux de completion élevé (>90%) | Peu de skips, écoutes complètes |
| `repeat_behavior` | Comportement de répétition détecté | Multiples écoutes rapprochées |
| `peak_period` | Période d'écoute intense identifiée | 5+ écoutes en 30 jours |
| `long_sessions` | Sessions d'écoute longues | Durée moyenne > 3 minutes |

## 🛠 Configuration

### Paramètres temporels
```typescript
interface ForgottenGemsConfig {
  minDaysSinceLastPlayed: number;  // 90 jours
  maxDaysSinceLastPlayed: number;  // 730 jours  
  lookbackPeriodDays: number;      // 365 jours
}
```

### Filtres de qualité
```typescript
interface QualityFilters {
  minTotalPlays: number;        // 3 écoutes
  minCompletionRate: number;    // 0.7 (70%)
  minAffinityScore: number;     // 100,000ms (~1.6 min)
  maxResults: number;           // 50 résultats
}
```

## 📊 Métriques et Analytics

### Analytics fournies
- **totalCandidates** : nombre total de tracks analysées
- **filteredResults** : tracks passant les filtres de qualité
- **averageDaysSinceLastPlayed** : moyenne des jours depuis dernière écoute
- **topReasons** : distribution des raisons de recommandation

### Optimisations performance
- **Mise en cache** : résultats cachés pendant plusieurs heures
- **Indexation** : index sur `userId` et `timestamp` pour les requêtes
- **Pagination** : limite configurée des résultats

## 🚀 Usage

### Service principal
```typescript
import { getForgottenGems } from "~/features/forgotten-gems/data/forgotten-gems-service";

const { gems, analytics } = await getForgottenGems(userId, {
  minDaysSinceLastPlayed: 60,
  maxResults: 30
});
```

### Composants UI
```typescript
import { 
  ForgottenGemsList, 
  ForgottenGemsAnalytics 
} from "~/features/forgotten-gems";

<ForgottenGemsAnalytics analytics={analytics} />
<ForgottenGemsList gems={gems} />
```

## 🔧 Extensibilité

### Ajout de nouvelles raisons
1. Étendre l'enum `reason` dans les types
2. Implémenter la logique dans `determineRecommendationReason()`
3. Ajouter les labels et icônes dans les composants UI

### Nouveaux algorithmes de scoring
1. Modifier `analyzeTrackPlays()` pour de nouvelles métriques
2. Ajuster `filterCandidates()` pour de nouveaux seuils
3. Mettre à jour la documentation des scores

### Améliorer la détection de patterns
- **Analyse saisonnière** : détection de patterns par saison/mois
- **Context-aware** : utilisation des raisons de lecture
- **Collaborative filtering** : comparaison avec d'autres utilisateurs

## 🎯 Cas d'usage

### Pour l'utilisateur
- Redécouvrir des favoris oubliés
- Explorer sa propre évolution musicale
- Créer des playlists nostalgiques

### Pour les développeurs
- Analyser les patterns de rétention musicale
- Optimiser les algorithmes de recommandation
- Comprendre le comportement d'écoute long-terme

## 📈 Métriques de succès

- **Taux de clic** : pourcentage de gems effectivement écoutées
- **Satisfaction** : feedback utilisateur sur la pertinence
- **Découverte** : nombre de tracks rajoutées aux playlists
- **Rétention** : retour des utilisateurs sur la fonctionnalité 