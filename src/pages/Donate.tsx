import { motion } from 'framer-motion';

export const Donate = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80dvh] flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        
        {/* Copy / Message */}
        <div className="z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8"
          >
            Sua vez de <br/><span className="text-accent italic font-light">agir.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-600 leading-relaxed max-w-lg mb-12"
          >
            Cada doação é convertida imediatamente em ação de ponta. Não guardamos tesouros, distribuímos socorro. Escolha o valor e financie uma missão hoje.
          </motion.p>
        </div>

        {/* Form Container (Liquid Glass) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="glass-effect rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle noise/gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10 w-full mb-8">
            <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-4 block">Selecione o Apoio</label>
            <div className="grid grid-cols-3 gap-4">
              {['R$ 50', 'R$ 150', 'R$ 500'].map((val, i) => (
                <button key={i} className="py-4 border border-zinc-700 rounded-2xl hover:border-accent hover:text-accent font-mono text-lg font-semibold transition-all">
                  {val}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input 
                type="text" 
                placeholder="Outro valor" 
                className="w-full bg-zinc-100/50 border border-zinc-200 rounded-2xl p-4 font-mono text-lg text-zinc-900 placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
               />
            </div>
          </div>

          <div className="relative z-10 w-full mb-10">
             <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-4 block">Frequência</label>
             <div className="flex bg-zinc-100/50 p-1 rounded-2xl border border-zinc-200">
               <button className="flex-1 py-3 text-center rounded-xl bg-zinc-800 font-medium text-zinc-900 shadow-sm">Única</button>
               <button className="flex-1 py-3 text-center rounded-xl text-zinc-500 hover:text-white transition-colors">Mensal</button>
             </div>
          </div>

          <button className="relative w-full overflow-hidden bg-zinc-950 text-white font-bold py-6 rounded-full text-xl hover:scale-[1.02] active:scale-[0.98] transition-all group">
            <span className="relative z-10">Finalizar Doação</span>
            <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          </button>
          <p className="text-center font-mono text-xs text-zinc-500 mt-6 mt:4 flex items-center justify-center gap-2">
            Transação Segura &bull; SSL Encrypted
          </p>
        </motion.div>

      </div>
    </div>
  );
};
