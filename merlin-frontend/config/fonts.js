import {
  Inter,
  Rubik,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
  Pacifico,
  Protest_Guerrilla
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const rubik = Rubik({ subsets: ["latin"], weight: "400", style: ["normal"] });
export const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
export const noto = Noto_Naskh_Arabic({
  subsets: ["latin"],
  weight: "500",
  style: ["normal"],
});
export const IBM = IBM_Plex_Sans_Arabic({ subsets: ["latin"], weight: "400" });
export const protest = Protest_Guerrilla({ subsets: ["latin"], weight: "400" });
