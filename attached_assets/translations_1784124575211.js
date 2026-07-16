/**
 * MPANOLONTSAINA IA — TEXTES DE L'INTERFACE (SOURCE UNIQUE I18N)
 * -----------------------------------------------------------------
 * Un seul fichier = une seule source de vérité pour tous les textes.
 * Ne JAMAIS écrire un texte en dur dans un composant : toujours passer par t("clé").
 *
 * Usage React :
 *   import { useI18n } from "./i18n/I18nContext";
 *   const { t, lang, setLang } = useI18n();
 *   <h1>{t("home.title")}</h1>
 *
 * Le backend accepte aussi "en" (voir 02_contrats_api_auth_users.md), mais
 * l'UI est livrée ici en FR/MG comme demandé. Ajouter une clé "en" plus tard
 * ne casse rien (fallback automatique vers "fr").
 */

export const translations = {
  fr: {
    app: {
      name: "Mpanolontsaina IA",
      tagline: "Votre conseiller juridique intelligent, en malgache et en français.",
    },
    nav: {
      home: "Accueil",
      chat: "Discuter",
      history: "Historique",
      account: "Mon compte",
      login: "Connexion",
      register: "Créer un compte",
      logout: "Déconnexion",
    },
    auth: {
      loginTitle: "Connexion",
      registerTitle: "Créer un compte",
      email: "Adresse e-mail",
      password: "Mot de passe",
      fullName: "Nom complet",
      preferredLanguage: "Langue préférée",
      submitLogin: "Se connecter",
      submitRegister: "S'inscrire",
      noAccount: "Pas encore de compte ?",
      haveAccount: "Déjà un compte ?",
      invalidCredentials: "Email ou mot de passe incorrect.",
      emailExists: "Un compte existe déjà avec cet email.",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
    },
    chat: {
      placeholder: "Posez votre question juridique...",
      send: "Envoyer",
      newConversation: "Nouvelle conversation",
      visitorBanner: "Vous discutez en tant qu'invité. Connectez-vous pour sauvegarder vos échanges.",
      thinking: "Mpanolontsaina IA réfléchit...",
      sourcesTitle: "Sources juridiques",
      rateLimited: "Trop de messages envoyés. Merci de patienter un instant ou de vous connecter.",
      emptyMessage: "Veuillez écrire un message avant d'envoyer.",
      errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
      domainDroitTravail: "Droit du travail",
      domainFoncier: "Droit foncier",
      domainFamille: "Droit de la famille",
    },
    history: {
      title: "Mes conversations",
      empty: "Aucune conversation pour le moment.",
      delete: "Supprimer",
      confirmDelete: "Supprimer cette conversation ?",
    },
    account: {
      title: "Mon profil",
      save: "Enregistrer les modifications",
      dangerZone: "Zone sensible",
      deleteAccount: "Supprimer mon compte",
      deleteWarning: "Cette action est définitive et irréversible.",
      confirmationLabel: "Tapez SUPPRIMER MON COMPTE pour confirmer",
    },
    common: {
      loading: "Chargement...",
      cancel: "Annuler",
      confirm: "Confirmer",
      close: "Fermer",
      retry: "Réessayer",
      languageSwitch: "MG / FR",
    },
  },

  mg: {
    app: {
      name: "Mpanolontsaina IA",
      tagline: "Ny mpanolo-tsaina ara-dalàna azo antoka, amin'ny teny malagasy sy frantsay.",
    },
    nav: {
      home: "Fandraisana",
      chat: "Miresaka",
      history: "Tantara",
      account: "Kaontiko",
      login: "Hiditra",
      register: "Mamorona kaonty",
      logout: "Hivoaka",
    },
    auth: {
      loginTitle: "Fidirana",
      registerTitle: "Famoronana kaonty",
      email: "Adiresy mailaka",
      password: "Tenimiafina",
      fullName: "Anarana feno",
      preferredLanguage: "Fiteny tiana",
      submitLogin: "Hiditra",
      submitRegister: "Hisoratra anarana",
      noAccount: "Tsy manana kaonty ianao ?",
      haveAccount: "Efa manana kaonty ?",
      invalidCredentials: "Diso ny mailaka na ny tenimiafina.",
      emailExists: "Efa misy kaonty mampiasa ity mailaka ity.",
      passwordTooShort: "Tsy maintsy misy litera 8 farafahakeliny ny tenimiafina.",
    },
    chat: {
      placeholder: "Apetraho eto ny fanontanianao ara-dalàna...",
      send: "Alefa",
      newConversation: "Resaka vaovao",
      visitorBanner: "Miresaka amin'ny maha-vahiny ianao. Midira mba hitehirizana ny resaka.",
      thinking: "Mieritreritra i Mpanolontsaina IA...",
      sourcesTitle: "Loharanon-kevitra ara-dalàna",
      rateLimited: "Be loatra ny hafatra nalefa. Miandrasa kely na midira.",
      emptyMessage: "Asio hafatra vao alefa.",
      errorGeneric: "Nisy olana nitranga. Andramo indray azafady.",
      domainDroitTravail: "Lalàna momba ny asa",
      domainFoncier: "Lalàna momba ny tany",
      domainFamille: "Lalàna momba ny fianakaviana",
    },
    history: {
      title: "Ny resako",
      empty: "Mbola tsy misy resaka voatahiry.",
      delete: "Fafao",
      confirmDelete: "Hofafana ve ity resaka ity ?",
    },
    account: {
      title: "Momba ahy",
      save: "Tehirizo ny fanovana",
      dangerZone: "Faritra mampisy risika",
      deleteAccount: "Fafao ny kaontiko",
      deleteWarning: "Tsy azo averina intsony ity fihetsika ity.",
      confirmationLabel: "Soraty hoe SUPPRIMER MON COMPTE hanamarinana",
    },
    common: {
      loading: "Eo am-piandrasana...",
      cancel: "Aoka ihany",
      confirm: "Ekeo",
      close: "Hidiana",
      retry: "Andramo indray",
      languageSwitch: "MG / FR",
    },
  },
};

export const supportedLanguages = ["fr", "mg"];
export const defaultLanguage = "fr";

export default translations;
