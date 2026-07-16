/**
 * MPANOLONTSAINA IA — PALETTE DE COULEURS (SOURCE UNIQUE)
 * ---------------------------------------------------------
 * Un seul fichier = une seule source de vérité pour toutes les couleurs.
 * Importer ce fichier partout, ne JAMAIS écrire un hex code en dur ailleurs.
 *
 * Concept design :
 * - Violet profond = sagesse, intelligence artificielle, confiance, réflexion
 * - Or / ocre chaud = clarté, conseil, chaleur humaine, identité malgache
 * - Neutres doux = lisibilité, interface moderne, calme
 *
 * Usage React :
 *   import { colors } from "./colors";
 *   <div style={{ background: colors.primary[600] }} />
 *
 * Usage Tailwind (tailwind.config.js) :
 *   const { colors } = require("./colors");
 *   theme: { extend: { colors } }
 */

export const colors = {
  // Couleur principale : intelligence / IA / confiance
  primary: {
    900: "#1B1035",
    800: "#271548",
    700: "#3D1F6E",
    600: "#5B2C9E", // couleur de marque principale
    500: "#7B42C4",
    400: "#9B6FDB",
    300: "#BE9AEA",
    200: "#DCC6F4",
    100: "#EDE4FB",
    50:  "#F7F2FD",
  },

  // Couleur d'accent : conseil / chaleur / action
  accent: {
    700: "#9C5E15",
    600: "#C77B22",
    500: "#E2963C", // couleur d'accent principale (CTA, boutons)
    400: "#F0B75E",
    300: "#F5CD8B",
    200: "#FAE2BB",
    100: "#FDF1DE",
  },

  // Neutres (fond, texte, bordures)
  neutral: {
    900: "#14121A",
    800: "#211E2C",
    700: "#332E42",
    600: "#524C63",
    500: "#726B85",
    400: "#8B8598",
    300: "#B3AEC0",
    200: "#E4E1EB",
    100: "#F7F5FB",
    50:  "#FBFAFD",
    white: "#FFFFFF",
  },

  // Couleurs sémantiques (états)
  semantic: {
    success: "#2FA86B",
    successBg: "#E4F6ED",
    warning: "#E0A526",
    warningBg: "#FBF0DA",
    error: "#E4483F",
    errorBg: "#FBE6E5",
    info: "#3B82C4",
    infoBg: "#E3EFFA",
  },

  // Spécifique à la fonctionnalité "chat / conseil IA"
  chat: {
    userBubbleBg: "#5B2C9E",
    userBubbleText: "#FFFFFF",
    aiBubbleBg: "#F7F5FB",
    aiBubbleText: "#211E2C",
    aiBubbleBorder: "#E4E1EB",
    typingDot: "#9B6FDB",
  },
};

// Génère automatiquement les variables CSS (:root) à partir de l'objet ci-dessus
export function generateCSSVariables() {
  let css = ":root {\n";
  for (const group in colors) {
    for (const shade in colors[group]) {
      css += `  --color-${group}-${shade}: ${colors[group][shade]};\n`;
    }
  }
  css += "}\n";
  return css;
}

export default colors;
