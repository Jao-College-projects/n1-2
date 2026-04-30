import { motion } from "framer-motion";
import { IMAGES } from "./assets";
import { easeEditorial } from "./motionPresets";

const verses = [
  "O tempo deixa a madeira mais honesta.",
  "Cada vão é medido para a luz entrar devagar.",
  "O silêncio também é desenho.",
];

export function LuarStory(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-parchment/30 px-6 py-28 sm:px-10 md:py-40 lg:px-16">
      {/* Large background section number */}
      <div
        className="pointer-events-none absolute right-4 top-6 select-none font-display font-light leading-none text-parchment/55 lg:right-10"
        style={{ fontSize: "clamp(8rem,18vw,15rem)" }}
        aria-hidden
      >
        02
      </div>

      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24 xl:gap-32">
          {/* Left sticky column */}
          <motion.div
            className="relative max-w-lg lg:sticky lg:top-32 lg:w-[40%]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={easeEditorial}
          >
            {/* Section label */}
            <div className="mb-7 flex items-center gap-3">
              <div className="h-px w-8 bg-gold-soft/60" />
              <span className="font-sans text-[0.58rem] uppercase tracking-[0.38em] text-mist">
                Oficina
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.3rem)] font-medium leading-[1.1] text-charcoal">
              O tempo como
              <br />
              <em className="font-light italic">matéria-prima</em>
            </h2>

            {/* Gold accent line */}
            <div className="mt-8 h-px w-12 bg-gold-soft/52" />

            {/* Verses with left border treatment */}
            <ul className="mt-10 space-y-5">
              {verses.map((line, i) => (
                <motion.li
                  key={line}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...easeEditorial, delay: 0.1 + i * 0.1 }}
                >
                  <div className="mt-2 h-3 w-px flex-shrink-0 bg-gold-soft/48" />
                  <p className="font-serif text-[1.02rem] italic leading-[1.72] text-ink/82 md:text-[1.12rem]">
                    {line}
                  </p>
                </motion.li>
              ))}
            </ul>

            {/* Supporting body copy */}
            <motion.p
              className="mt-10 font-sans text-[0.83rem] font-light leading-[1.88] text-mist/78"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...easeEditorial, delay: 0.38 }}
            >
              Cada peça passa por um processo artesanal que valoriza a essência natural dos materiais — madeiras certificadas, acabamentos à mão.
            </motion.p>
          </motion.div>

          {/* Right image composition */}
          <div className="relative flex flex-1 flex-col gap-8 lg:mt-8 lg:gap-12">
            <motion.figure
              className="relative ml-0 w-[94%] max-w-2xl self-end overflow-hidden lg:w-[90%]"
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...easeEditorial, delay: 0.08 }}
            >
              <img
                src={IMAGES.storyA}
                alt=""
                className="aspect-[4/5] w-full object-cover object-[center_35%] sm:aspect-[5/6] shadow-[0_32px_70px_-18px_rgba(28,25,23,0.28)]"
                loading="lazy"
              />
              <figcaption className="mt-3 text-right">
                <span className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-mist/55">
                  Ateliê · Goiânia
                </span>
              </figcaption>
            </motion.figure>

            <motion.figure
              className="relative -mt-4 w-[72%] max-w-md self-start overflow-hidden sm:-mt-8 lg:-ml-4"
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...easeEditorial, delay: 0.18 }}
            >
              <img
                src={IMAGES.storyB}
                alt=""
                className="aspect-[3/4] w-full rotate-[-1.5deg] object-cover sm:aspect-[4/5] shadow-[0_28px_60px_-16px_rgba(28,25,23,0.32)]"
                loading="lazy"
              />
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}
