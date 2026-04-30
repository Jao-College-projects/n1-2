import { motion } from "framer-motion";

interface DashboardStatsProps {
  totalPecas: number;
  totalCategorias: number;
  ticketMedio: number;
  totalEstoque: number;
  itensSacola: number;
}

export function DashboardStats({ totalPecas, totalCategorias, ticketMedio, totalEstoque, itensSacola }: DashboardStatsProps): JSX.Element {
  return (
    // row-cols-lg-5 força 5 colunas iguais no desktop
    <div className="row g-3 g-lg-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mb-10">
      
      {/* Total de Peças */}
      <div className="col">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all h-100"
        >
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold-dark mb-1">Total de Peças</p>
          <h3 className="font-display text-[1.5rem] font-medium text-charcoal m-0">{totalPecas}</h3>
          <div className="h-0.5 w-6 bg-stone-100 mt-2" />
        </motion.div>
      </div>

      {/* Categorias */}
      <div className="col">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all h-100"
        >
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold-dark mb-1">Categorias</p>
          <h3 className="font-display text-[1.5rem] font-medium text-charcoal m-0">{totalCategorias}</h3>
          <div className="h-0.5 w-6 bg-stone-100 mt-2" />
        </motion.div>
      </div>

      {/* Ticket Médio */}
      <div className="col">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all h-100"
        >
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold-dark mb-1">Ticket Médio</p>
          <h3 className="font-display text-[1.2rem] font-medium text-charcoal m-0">
            R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h3>
          <div className="h-0.5 w-6 bg-stone-100 mt-2" />
        </motion.div>
      </div>

      {/* Total em Estoque */}
      <div className="col">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all h-100"
        >
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold-dark mb-1">Estoque Total</p>
          <h3 className="font-display text-[1.5rem] font-medium text-charcoal m-0">{totalEstoque}</h3>
          <div className="h-0.5 w-6 bg-stone-100 mt-2" />
        </motion.div>
      </div>

      {/* Itens na Sacola */}
      <div className="col">
        <motion.div
          key={itensSacola}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-4 rounded-xl shadow-sm transition-all duration-500 border h-100 ${
            itensSacola > 0
              ? 'bg-gold-soft/10 border-gold-soft/50 shadow-[0_0_15px_rgba(202,138,4,0.1)]'
              : 'bg-white border-stone-200'
          }`}
        >
          <p className={`font-sans text-[0.6rem] uppercase tracking-[0.2em] mb-1 ${itensSacola > 0 ? 'text-gold-dark' : 'text-mist'}`}>
            Na Sacola
          </p>
          <div className="flex items-center gap-2">
            <h3 className={`font-display text-[1.5rem] font-medium transition-colors duration-300 ${itensSacola > 0 ? 'text-gold-soft' : 'text-charcoal'} m-0`}>
              {itensSacola}
            </h3>
            {itensSacola > 0 && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-gold-soft"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            )}
          </div>
          <div className={`h-0.5 w-6 mt-2 transition-colors duration-500 ${itensSacola > 0 ? 'bg-gold-soft/40' : 'bg-stone-100'}`} />
        </motion.div>
      </div>

    </div>
  );
}
