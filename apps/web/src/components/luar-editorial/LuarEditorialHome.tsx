import { LuarHero } from "./LuarHero";
import { LuarManifesto } from "./LuarManifesto";
import { LuarAmbientes } from "./LuarAmbientes";
import { LuarCurated } from "./LuarCurated";
import { LuarExperiencias } from "./LuarExperiencias";
import { LuarBrandNumbers } from "./LuarBrandNumbers";
import { LuarEditorialFooter } from "./LuarEditorialFooter";

export function LuarEditorialHome(): JSX.Element {
  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal antialiased">
      <LuarHero />
      <LuarManifesto />
      <LuarAmbientes />
      <LuarCurated />
      <LuarExperiencias />
      <LuarBrandNumbers />
      <LuarEditorialFooter />
    </div>
  );
}
