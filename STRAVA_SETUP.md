# Configuration Strava OAuth

## Problème actuel
Erreur "Échec de la requête" lors de l'autorisation Strava.

## Solution

### 1. Configuration dans Strava API Settings
Allez sur https://www.strava.com/settings/api

#### Authorization Callback Domain:
Pour le développement mobile avec Expo, entrez: **`localhost`**

⚠️ **Important**: 
- Entrez SEULEMENT: `localhost` (sans http://, sans slashes, sans port)
- Pour Strava mobile OAuth, `localhost` est le seul redirect URI accepté
- L'app utilisera exactement: `http://localhost`

### 2. Vérification des informations
- Client ID: `191119` ✓
- Client Secret: Configuré dans .env ✓
- Scopes: `activity:read` ✓

### 3. Redirect URI utilisé
L'app utilise le redirect URI standard pour Strava mobile:
```
http://localhost
```

C'est le seul format accepté par Strava pour les applications mobiles OAuth.

### 4. Logs pour déboguer
Avec les logs ajoutés, vous pouvez maintenant voir dans la console:
- Backend: Les détails de la requête d'échange de token
- Frontend: Les détails de l'erreur si l'échange échoue

### 5. Test
1. Redémarrez le backend: `cd Backend && npm run dev`
2. Redémarrez l'app: `cd Frontend && npx expo start --clear`
3. Essayez de vous connecter à nouveau
4. Vérifiez les logs dans les deux terminaux

## Erreurs communes

### "Bad Request"
- Le code d'autorisation a expiré (valide 30 secondes)
- Le redirect_uri ne correspond pas

### "Unauthorized"  
- Client ID ou Secret incorrect

### "Invalid Authorization Code"
- Le code a déjà été utilisé
- Le redirect_uri est différent entre auth et token exchange
