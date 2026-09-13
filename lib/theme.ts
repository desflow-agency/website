// Motyw strony publicznej (ciemny domyślnie). Wspólne dla layoutu (skrypt startowy) i przełącznika.

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "desflow-theme";

export const themeColors: Record<Theme, string> = {
  dark: "#07070b",
  light: "#f6f6fa",
};

// Uruchamiany w <head> przed pierwszym malowaniem — bez mignięcia złego motywu.
export const themeInitScript = `(function(){var t="dark";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="light"||s==="dark")t=s}catch(e){}document.documentElement.dataset.theme=t})()`;
