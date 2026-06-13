import { permanentRedirect } from "next/navigation";

export default function ChineseHomeRedirectPage() {
  permanentRedirect("/zh/cursive-text-generator");
}
