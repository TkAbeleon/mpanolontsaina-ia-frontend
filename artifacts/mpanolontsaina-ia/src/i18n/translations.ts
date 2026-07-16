/**
 * MPANOLONTSAINA IA — TEXTES DE L'INTERFACE (SOURCE UNIQUE I18N)
 * -----------------------------------------------------------------
 * Un seul fichier = une seule source de vérité pour tous les textes.
 * Ne JAMAIS écrire un texte en dur dans un composant : toujours passer par t("clé").
 *
 * Usage React :
 *   import { useI18n } from "@/i18n/I18nContext";
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
      name: 'Mpanolontsaina IA',
      tagline: 'Votre conseiller juridique intelligent, en malgache et en français.',
    },
    nav: {
      home: 'Accueil',
      chat: 'Discuter',
      history: 'Historique',
      account: 'Mon compte',
      login: 'Connexion',
      register: 'Créer un compte',
      logout: 'Déconnexion',
    },
    auth: {
      loginTitle: 'Connexion',
      registerTitle: 'Créer un compte',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      fullName: 'Nom complet',
      preferredLanguage: 'Langue préférée',
      submitLogin: 'Se connecter',
      submitRegister: "S'inscrire",
      noAccount: 'Pas encore de compte ?',
      haveAccount: 'Déjà un compte ?',
      invalidCredentials: 'Email ou mot de passe incorrect.',
      emailExists: 'Un compte existe déjà avec cet email.',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
    },
    chat: {
      placeholder: 'Posez votre question juridique...',
      send: 'Envoyer',
      newConversation: 'Nouvelle conversation',
      visitorBanner:
        'Vous discutez en tant qu\'invité. Connectez-vous pour sauvegarder vos échanges.',
      thinking: 'Mpanolontsaina IA réfléchit...',
      sourcesTitle: 'Sources juridiques',
      rateLimited: 'Trop de messages envoyés. Merci de patienter un instant ou de vous connecter.',
      emptyMessage: 'Veuillez écrire un message avant d\'envoyer.',
      errorGeneric: 'Une erreur est survenue. Veuillez réessayer.',
      domainDroitTravail: 'Droit du travail',
      domainFoncier: 'Droit foncier',
      domainFamille: 'Droit de la famille',
      disclaimer:
        "Mpanolontsaina IA fournit une information générale, non un avis juridique personnalisé.",
      unauthorized: 'Votre session a expiré. Veuillez vous reconnecter.',
    },
    history: {
      title: 'Mes conversations',
      empty: 'Aucune conversation pour le moment.',
      delete: 'Supprimer',
      confirmDelete: 'Supprimer cette conversation ?',
    },
    account: {
      title: 'Mon profil',
      save: 'Enregistrer les modifications',
      sessionTitle: 'Session',
      sessionDescription: 'Vous êtes connecté sur cet appareil.',
      dangerZone: 'Zone sensible',
      deleteAccount: 'Supprimer mon compte',
      deleteWarning: 'Cette action est définitive et irréversible.',
      confirmationLabel: 'Tapez SUPPRIMER MON COMPTE pour confirmer',
    },
    common: {
      loading: 'Chargement...',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      close: 'Fermer',
      retry: 'Réessayer',
      languageSwitch: 'MG / FR',
      themeLight: 'Mode clair',
      themeDark: 'Mode sombre',
      themeToggle: 'Changer de thème',
    },
    footer: {
      about: 'À propos',
      privacy: 'Confidentialité',
      terms: "Conditions d'utilisation",
      rights: 'Tous droits réservés.',
    },
    about: {
      title: 'À propos de Mpanolontsaina IA',
      intro:
        "Mpanolontsaina IA est un assistant juridique intelligent, conçu pour rendre le droit malgache compréhensible et accessible à tous, en malgache comme en français.",
      missionTitle: 'Notre mission',
      missionText:
        "Beaucoup de personnes à Madagascar renoncent à faire valoir leurs droits — travail, foncier, famille — par manque d'information claire et accessible. Mpanolontsaina IA répond à vos questions juridiques en langage simple, en citant systématiquement les textes de loi sur lesquels s'appuie chaque réponse.",
      howItWorksTitle: 'Comment ça fonctionne',
      howItWorksText:
        "Posez votre question en malgache ou en français. Notre assistant analyse votre demande, recherche les articles de loi pertinents, puis rédige une réponse claire accompagnée de ses sources. Vous pouvez discuter librement sans créer de compte, ou vous connecter pour retrouver l'historique de vos échanges.",
      disclaimerTitle: 'Une information, pas un avis juridique',
      disclaimerText:
        "Mpanolontsaina IA fournit une information juridique générale à but éducatif. Il ne remplace pas la consultation d'un avocat ou d'un professionnel du droit pour une situation personnelle. En cas de litige important, faites toujours confirmer les informations par un professionnel.",
    },
    privacy: {
      title: 'Politique de confidentialité',
      intro:
        "Cette page explique quelles données Mpanolontsaina IA collecte, comment elles sont utilisées, et quels sont vos droits.",
      dataTitle: 'Quelles données sont collectées',
      dataText:
        "Si vous créez un compte : votre nom, votre adresse e-mail et votre mot de passe (chiffré). Si vous discutez sans compte (mode invité) : uniquement un identifiant de session temporaire, sans donnée personnelle identifiable. Dans les deux cas : le contenu de vos messages, afin de générer une réponse.",
      useTitle: 'Comment vos données sont utilisées',
      useText:
        "Vos messages sont utilisés uniquement pour générer une réponse juridique pertinente et, si vous êtes connecté, pour conserver l'historique de vos conversations afin que vous puissiez y revenir. Vos données ne sont jamais vendues à des tiers.",
      retentionTitle: 'Conservation des données',
      retentionText:
        "Les conversations en mode invité ne sont pas conservées après la session. Les conversations des comptes enregistrés sont conservées jusqu'à ce que vous les supprimiez, ou que vous supprimiez votre compte.",
      rightsTitle: 'Vos droits',
      rightsText:
        "Vous pouvez à tout moment consulter, modifier ou supprimer vos informations depuis la page \"Mon compte\", y compris demander la suppression complète ou l'anonymisation de votre compte.",
      contactTitle: 'Contact',
      contactText:
        "Pour toute question sur vos données personnelles, contactez-nous via l'adresse indiquée dans l'application.",
    },
    terms: {
      title: "Conditions d'utilisation",
      intro:
        "En utilisant Mpanolontsaina IA, vous acceptez les conditions suivantes.",
      usageTitle: 'Utilisation du service',
      usageText:
        "Mpanolontsaina IA est destiné à fournir une information juridique générale. Vous vous engagez à ne pas utiliser le service à des fins illégales ou pour obtenir des informations trompeuses sur des tiers.",
      liabilityTitle: 'Limitation de responsabilité',
      liabilityText:
        "Les réponses fournies sont générées automatiquement à partir de textes de loi et ne constituent pas un avis juridique personnalisé. Mpanolontsaina IA ne peut être tenu responsable des décisions prises sur la seule base des réponses de l'assistant.",
      accountsTitle: 'Comptes utilisateurs',
      accountsText:
        "Vous êtes responsable de la confidentialité de votre mot de passe. Vous pouvez supprimer votre compte à tout moment depuis la page \"Mon compte\".",
    },
  },

  mg: {
    app: {
      name: 'Mpanolontsaina IA',
      tagline: "Ny mpanolotsaina ara-dalàna azo antoka, amin'ny teny Malagasy sy Frantsay.",
    },
    nav: {
      home: 'Fandraisana',
      chat: 'Resaka',
      history: 'Tantara',
      account: 'Kaontiko',
      login: 'Hiditra',
      register: 'Mamorona kaonty',
      logout: 'Hivoaka',
    },
    auth: {
      loginTitle: 'Fidirana',
      registerTitle: 'Famoronana kaonty',
      email: 'Adiresy mailaka',
      password: 'Tenimiafina',
      fullName: 'Anarana feno',
      preferredLanguage: 'Fiteny nosafidiana',
      submitLogin: 'Hiditra',
      submitRegister: 'Hisoratra anarana',
      noAccount: 'Mbola tsy manana kaonty ?',
      haveAccount: 'Efa manana kaonty ?',
      invalidCredentials: 'Diso ny mailaka na ny tenimiafina.',
      emailExists: 'Efa misy kaonty mampiasa ity mailaka ity.',
      passwordTooShort: 'Tsy maintsy misy tarehintsoratra 8 farafahakeliny ny tenimiafina.',
    },
    chat: {
      placeholder: 'Apetraho eto ny fanontanianao ara-dalàna...',
      send: 'Alefaso',
      newConversation: 'Resaka vaovao',
      visitorBanner: "Miresaka amin'ny maha vahiny ianao. Midira mba hitehirizana ny resaka.",
      thinking: 'Eo am-pandinihana ny Mpanolontsaina IA...',
      sourcesTitle: 'Loharano ara-dalàna',
      rateLimited: 'Be loatra ny hafatra nalefa. Miandrasa kely na midira.',
      emptyMessage: "Mampidira hafatra alohan'ny handefasana.",
      errorGeneric: 'Nisy hadisoana nitranga. Andramo indray azafady.',
      domainDroitTravail: 'Lalàna momba ny asa',
      domainFoncier: 'Lalàna momba ny tany',
      domainFamille: 'Lalàna momba ny fianakaviana',
      disclaimer:
        "Ny Mpanolontsaina IA dia manome fampahalalana ankapobeny ihany, fa tsy torohevitra ara-dalàna manokana.",
      unauthorized: 'Tapitra ny fotoam-pidiranao. Midira indray azafady.',
    },
    history: {
      title: 'Ny resaka nataoko',
      empty: 'Mbola tsy misy resaka voatahiry.',
      delete: 'Fafao',
      confirmDelete: 'Hofafana ve ity resaka ity ?',
    },
    account: {
      title: 'Momba ahy',
      save: 'Tahirizo ny fanovana',
      sessionTitle: 'Fidirana (Session)',
      sessionDescription: "Tafiditra amin'ity fitaovana ity ianao izao.",
      dangerZone: 'Faritra saro-pady',
      deleteAccount: 'Fafao ny kaontiko',
      deleteWarning: 'Hetsika tsy azo ivalozana ity.',
      confirmationLabel: 'Soraty hoe SUPPRIMER MON COMPTE hanamarinana',
    },
    common: {
      loading: 'Eo am-pikarakarana...',
      cancel: 'Hanafoana',
      confirm: 'Hanamafy',
      close: 'Hidio',
      retry: 'Andramo indray',
      languageSwitch: 'MG / FR',
      themeLight: 'Endrika mazava',
      themeDark: 'Endrika maizina',
      themeToggle: 'Hanova endrika',
    },
    footer: {
      about: 'Momba anay',
      privacy: 'Fiarovana ny tsiambaratelo',
      terms: 'Fepetra fampiasana',
      rights: 'Zo rehetra voatokana.',
    },
    about: {
      title: 'Momba ny Mpanolontsaina IA',
      intro:
        "Ny Mpanolontsaina IA dia mpanolotsaina ara-dalàna manan-tsaina, natao hahafahan'ny rehetra mahatakatra sy mampiasa ny lalàna malagasy, amin'ny teny Malagasy sy Frantsay.",
      missionTitle: 'Ny tanjonay',
      missionText:
        "Maro ny Malagasy no tsy sahy mitaky ny zony — momba ny asa, ny tany, ny fianakaviana — noho ny tsy fahampian'ny fampahalalana mazava sy mora azo. Ny Mpanolontsaina IA dia mamaly ny fanontanianao ara-dalàna amin'ny fomba tsotra, sady manondro mazava ireo andinindalàna nifotoren'ny valinteny.",
      howItWorksTitle: 'Ny fomba fiasany',
      howItWorksText:
        "Apetraho amin'ny teny Malagasy na Frantsay ny fanontanianao. Handinika ny fangatahanao ilay mpanolotsaina, hikaroka ireo andinindalàna mifandraika amin'izany, ary hanome valiny mazava miaraka amin'ny loharanony. Azonao atao ny miresaka avy hatrany tsy mamorona kaonty, na miditra mba hitehirizana ny tantaran'ny resakao.",
      disclaimerTitle: 'Fampahalalana ihany, fa tsy torohevitra ara-dalàna',
      disclaimerText:
        "Ny Mpanolontsaina IA dia manome fampahalalana ara-dalàna ankapobeny ho fampianarana. Tsy natao hisolo toerana ny torohevitry ny mpisolovava na ny manampahaizana manokana momba ny lalàna izy ity. Raha misy raharaha saro-pady, dia entanina ianao hanatona manampahaizana hanamafy ny fampahalalana.",
    },
    privacy: {
      title: 'Politika momba ny tsiambaratelo',
      intro:
        "Ity pejy ity dia manazava ireo angondrakitra angonin'ny Mpanolontsaina IA, ny fomba ampiasana izany, ary ireo zonao.",
      dataTitle: 'Ireo angondrakitra angonina',
      dataText:
        "Raha mamorona kaonty ianao: ny anaranao, ny adiresy mailakao ary ny tenimiafinao (voaaro). Raha miresaka amin'ny maha vahiny anao ianao (tsy misy kaonty): famantarana vonjimaika ihany no raisina, tsy misy angondrakitra manokana. Amin'ireo tranga roa ireo: ny vontoatin'ny hafatrao dia angonina mba hahafahana mamokatra valinteny.",
      useTitle: 'Ny fampiasana ny angondrakitrao',
      useText:
        "Ampiasaina hamokarana valinteny ara-dalàna mifanentana ny hafatrao, ary raha miditra amin'ny kaontinao ianao, dia ampiasaina hitehirizana ny tantaran'ny resakao izany. Tsy hamidy amin'ny olon-kafa na rahoviana na rahoviana ny angondrakitrao.",
      retentionTitle: 'Fitehirizana ny angondrakitra',
      retentionText:
        "Ny resaka ataon'ny mpitsidika dia tsy tehirizina aorian'ny fampiasana. Ny resaka amin'ny alalan'ny kaonty kosa dia tehirizina mandra-pamafanao azy ireo, na mandra-pamafanao ny kaontinao.",
      rightsTitle: 'Ny zonao',
      rightsText:
        "Afaka mijery, manova na mamafa ny fampahalalana momba anao ianao amin'ny fotoana rehetra ao amin'ny pejy \"Kaontiko\", anisan'izany ny fangatahana ny famafana tanteraka ny kaontinao.",
      contactTitle: 'Fifandraisana',
      contactText:
        "Raha manana fanontaniana momba ny angondrakitrao manokana ianao, dia mifandraisa aminay amin'ny alalan'ny adiresy hita ao amin'ny rindranasa.",
    },
    terms: {
      title: 'Fepetra fampiasana',
      intro:
        "Amin'ny fampiasanao ny Mpanolontsaina IA dia manaiky ireto fepetra manaraka ireto ianao.",
      usageTitle: 'Fampiasana ny serivisy',
      usageText:
        "Ny Mpanolontsaina IA dia natao hanomezana fampahalalana ara-dalàna ankapobeny. Manaiky ianao fa tsy hampiasa ny serivisy amin'ny fomba tsy ara-dalàna na hitadiavana fampahalalana mamitaka momba ny olon-kafa.",
      liabilityTitle: 'Famerana ny andraikitra',
      liabilityText:
        "Ny valinteny omena dia avy amin'ny famakafakana ireo rijan-tenin'ny lalàna, ary tsy natao ho torohevitra ara-dalàna ho an'ny tranga manokana. Ny Mpanolontsaina IA dia tsy tompon'andraikitra amin'izay fanapahan-kevitra horaisinao miainga amin'ny valinteny nomeny.",
      accountsTitle: "Kaontin'ny mpampiasa",
      accountsText:
        "Tompon'andraikitra amin'ny fiarovana ny tenimiafinao ianao. Azonao fafana amin'ny fotoana rehetra ny kaontinao ao amin'ny pejy \"Kaontiko\".",
    },
  },
} as const;

export type Language = 'fr' | 'mg';

export const supportedLanguages: Language[] = ['fr', 'mg'];
export const defaultLanguage: Language = 'fr';

export default translations;
