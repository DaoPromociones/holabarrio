# Foundation Builder

Un boilerplate Next.js suivant l'architecture hexagonale (Clean Architecture / Ports & Adapters) avec intégrations Firebase et Stripe.

## 🏗️ Architecture

Ce projet suit les principes de l'architecture hexagonale pour séparer clairement la logique métier des détails techniques :

### Structure des dossiers

- `src/core/services` : Logique métier (use cases, business rules)
- `src/core/ports/in` : Interfaces de contrat pour les cas d'usage entrants
- `src/core/ports/out` : Interfaces de contrat pour les dépendances sortantes
- `src/core/models` : Entités métiers
- `src/repositories` : Implémentations concrètes des interfaces externes
- `src/lib/di-container` : Injection de dépendances
- `src/hooks` : Custom hooks React

## 🚀 Fonctionnalités

### Authentification (Firebase Auth)

- Connexion email/mot de passe
- Connexion Google
- Gestion des états d'authentification
- Composants réutilisables

### Gestion des utilisateurs (Firestore)

- CRUD complet des utilisateurs
- Synchronisation temps réel
- API REST + hooks React

### Paiements (Stripe)

- Payment Intents avec Stripe Elements
- Checkout Sessions hébergées
- Gestion des webhooks
- Composants de paiement prêts à l'emploi

## 📦 Installation

1. Clonez le repository

```bash
git clone <repository-url>
cd foundation.builder
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez les variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez vos clés Firebase et Stripe :

```env
# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

4. Lancez le serveur de développement

```bash
npm run dev
```

## 🎯 Pages de démonstration

- `/` - Page d'accueil avec gestion CRUD des utilisateurs
- `/auth-demo` - Démonstration de l'authentification
- `/payment-demo` - Démonstration des paiements Stripe

## 🔧 Règles de développement

### Nommage

- **Services** : `[Entity]Service` (ex: `UserService`)
- **Ports In** : `[Entity]PortIn` (ex: `UserPortIn`)
- **Ports Out** : `[Entity]Repository` (ex: `UserRepository`)
- **Repositories** : `[Technology][Entity]RepositoryImpl` (ex: `FirestoreUserRepositoryImpl`)

### Fichiers

- **Services** : `[entity].service.ts`
- **Ports In** : `[entity].port.ts`
- **Ports Out** : `[entity].repository.ts`
- **Models** : `[entity].ts`
- **Repositories** : `[technology].[entity].repository.ts`

### Principes

- Responsabilité unique
- Return early (pas de if/else)
- Immutabilité dans `src/core`
- Gestion explicite des erreurs
- Types stricts TypeScript
- Classes dans `src/core/services` et `src/repositories`
- Composition plutôt qu'héritage

## 🧪 Cartes de test Stripe

Pour tester les paiements en mode développement :

- **Succès** : `4242 4242 4242 4242`
- **Carte refusée** : `4000 0000 0000 0002`
- **Fonds insuffisants** : `4000 0000 0000 9995`
- **Date d'expiration** : N'importe quelle date future
- **CVC** : N'importe quel nombre à 3 chiffres

## 📁 Structure détaillée

```
src/
├── app/                          # Pages Next.js
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentification
│   │   ├── users/              # Gestion utilisateurs
│   │   └── payments/           # Paiements Stripe
│   ├── auth-demo/              # Page démo auth
│   ├── payment-demo/           # Page démo paiements
│   └── page.tsx                # Page d'accueil
├── components/                  # Composants React
│   ├── AuthFormApi.tsx         # Auth via API
│   ├── AuthFormHook.tsx        # Auth via hook
│   ├── PaymentForm.tsx         # Formulaire paiement
│   └── CheckoutButton.tsx      # Bouton Checkout
├── core/                       # Logique métier
│   ├── models/                 # Entités
│   │   ├── user.ts
│   │   └── payment.ts
│   ├── ports/
│   │   ├── in/                 # Interfaces entrantes
│   │   │   ├── auth.port.ts
│   │   │   ├── user.port.ts
│   │   │   └── payment.port.ts
│   │   └── out/                # Interfaces sortantes
│   │       ├── auth.repository.ts
│   │       ├── user.repository.ts
│   │       └── payment.repository.ts
│   └── services/               # Services métier
│       ├── auth.service.ts
│       ├── user.service.ts
│       └── payment.service.ts
├── hooks/                      # Custom hooks
│   ├── useAuth.ts
│   ├── useUserSubscription.ts
│   └── usePayment.ts
├── lib/                        # Configuration
│   ├── di-container.ts         # Injection dépendances
│   ├── firebase-client.ts      # Config Firebase
│   ├── firebase.utils.ts       # Utilitaires Firebase
│   └── stripe-client.ts        # Config Stripe
└── repositories/               # Implémentations
    ├── firebase.auth.repository.impl.ts
    ├── firestore.user.repository.impl.ts
    └── stripe.payment.repository.ts
```

## 🤝 Contribution

1. Respectez l'architecture hexagonale
2. Suivez les conventions de nommage
3. Écrivez des tests pour la logique métier
4. Documentez les nouvelles fonctionnalités
