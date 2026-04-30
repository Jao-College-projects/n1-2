import { motion } from "framer-motion";
import { easeEditorial } from "./motionPresets";
import { useLoja } from "../../store/LojaContext";
import { EditableSectionField } from "../ui/EditableSectionField";

const marqueeItems = [
  "Luar Móveis",
  "·",
  "Goiânia",
  "·",
  "Curadoria Boutique",
  "·",
  "Desde 2013",
  "·",
  "Móveis Atemporais",
  "·",
  "Artesanato Brasileiro",
  "·",
  "12 Anos de Excelência",
  "·",
];

const metrics = [
  { value: "12", unit: "anos", label: "de curadoria artesanal", detail: "Moldando espaços com intencionalidade e silêncio." },
  { value: "3K", unit: "+",    label: "peças entregues",        detail: "Em residências autorais por todo o Brasil." },
  { value: "100",unit: "%",    label: "madeira certificada",    detail: "Reflorestamento e cadeia produtiva ética." },
  { value: "GO", unit: "·BR",  label: "ateliê exclusivo",       detail: "Showroom em Goiânia, atendimento sob consulta." },
];

export function LuarBrandNumbers(): JSX.Element {
  const { secoesHome } = useLoja();
  const brandSecao = secoesHome.find(s => s.identificador === 'brand_numbers');
  const conteudo = brandSecao?.conteudo || {};

  const currentMarquee = conteudo.marquee || marqueeItems;
  const repeated = [...currentMarquee, ...currentMarquee];

  const currentMetrics = conteudo.metrics || metrics;

  return (
    <section className="overflow-hidden bg-charcoal">

      {/* ── Marquee ─────────────────────────────────────── */}
      <div className="border-b border-stone-800/60 py-5 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: "marquee 36s linear infinite", willChange: "transform", transform: "translateZ(0)" }}
        >
          {[1, 2].map((loop) => (
            <div key={loop} className="flex gap-12 whitespace-nowrap">
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="marquee_1"
                fallback="Luar Móveis"
                className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-stone-300"
              />
              <span className="text-gold-soft">·</span>
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="marquee_2"
                fallback="Goiânia"
                className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-stone-300"
              />
              <span className="text-gold-soft">·</span>
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="marquee_3"
                fallback="Curadoria Boutique"
                className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-stone-300"
              />
              <span className="text-gold-soft">·</span>
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="marquee_4"
                fallback="Desde 2013"
                className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-stone-300"
              />
              <span className="text-gold-soft">·</span>
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="marquee_5"
                fallback="Móveis Atemporais"
                className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-stone-300"
              />
              <span className="text-gold-soft">·</span>
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="marquee_6"
                fallback="Artesanato Brasileiro"
                className="font-sans text-[0.82rem] uppercase tracking-[0.28em] text-stone-300"
              />
              <span className="text-gold-soft">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Métricas ─────────────────────────────────────── */}
      <div className="px-6 pb-0 pt-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">

          {/* Label da seção */}
          <motion.div
            className="mb-16 flex items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={easeEditorial}
          >
            <div className="h-px w-8 bg-gold-soft/70" />
            <EditableSectionField
              secaoIdentificador="brand_numbers"
              conteudoKey="titulo_secao"
              fallback="Em números"
              as="span"
              className="font-sans text-[0.82rem] uppercase tracking-[0.32em] text-stone-300"
            />
          </motion.div>

          {/* Grid 4 colunas */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4 lg:gap-x-12">
            {currentMetrics.map((m: any, i: number) => (
              <motion.div
                key={i}
                className="group flex flex-col gap-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...easeEditorial, delay: i * 0.12 }}
              >
                {/* Valor + unidade */}
                <div className="flex items-end gap-2 leading-none">
                  <EditableSectionField
                    secaoIdentificador="brand_numbers"
                    conteudoKey={["metrics", i, "value"]}
                    fallback={m.value}
                    as="span"
                    className="font-display font-light text-cream"
                    style={{ fontSize: "clamp(3.8rem,7vw,6rem)", lineHeight: 1 }}
                  />
                  <EditableSectionField
                    secaoIdentificador="brand_numbers"
                    conteudoKey={["metrics", i, "unit"]}
                    fallback={m.unit}
                    as="span"
                    className="mb-1 font-display font-medium text-gold-soft"
                    style={{ fontSize: "clamp(1.8rem,3.2vw,2.6rem)", lineHeight: 1 }}
                  />
                </div>

                {/* Linha dourada animada */}
                <div className="mt-4 h-px w-10 origin-left bg-gold-soft/60 transition-all duration-700 ease-editorial group-hover:w-20 group-hover:bg-gold-soft" />

                {/* Label */}
                <EditableSectionField
                  secaoIdentificador="brand_numbers"
                  conteudoKey={["metrics", i, "label"]}
                  fallback={m.label}
                  as="p"
                  className="mt-4 font-sans text-[0.9rem] font-medium uppercase tracking-[0.16em] text-stone-200"
                />

                {/* Detalhe */}
                <EditableSectionField
                  secaoIdentificador="brand_numbers"
                  conteudoKey={["metrics", i, "detail"]}
                  fallback={m.detail}
                  as="p"
                  className="mt-2 font-sans text-[0.88rem] font-light leading-[1.72] text-stone-400"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Divisor ──────────────────────────────────────── */}
      <div className="mx-auto mt-24 max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-700/60 to-transparent" />
      </div>

      {/* ── Citação central ──────────────────────────────── */}
      <div className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...easeEditorial, delay: 0.1 }}
          >
            {/* Aspas decorativas */}
            <span
              className="select-none font-display font-light leading-none text-gold-soft/20"
              style={{ fontSize: "6rem", lineHeight: 0.8 }}
              aria-hidden
            >
              "
            </span>

            <EditableSectionField
              secaoIdentificador="brand_numbers"
              conteudoKey="citacao"
              fallback="Não fazemos móveis. Criamos os lugares onde a vida acontece com graça."
              as="p"
              className="mt-4 max-w-4xl font-display font-medium leading-[1.22] tracking-[0.01em] text-cream"
              style={{ fontSize: "clamp(1.7rem,3.8vw,3rem)" }}
            />

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-12 bg-gold-soft/40" />
              <EditableSectionField
                secaoIdentificador="brand_numbers"
                conteudoKey="autor"
                fallback="Fundador · Luar Móveis"
                as="p"
                className="font-sans text-[0.82rem] uppercase tracking-[0.3em] text-stone-400"
              />
              <div className="h-px w-12 bg-gold-soft/40" />
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
