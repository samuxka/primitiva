import { motion } from 'framer-motion';
import { useMissions } from '../context/MissionsContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';

export const Missions = () => {
  const { missions } = useMissions();
  const { formatCurrency } = useCurrency();

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 flex-1 w-full">
      <div className="mb-24 md:w-1/2">
        <h1 className="text-6xl font-bold tracking-tighter mb-6 text-zinc-950">Frentes de <br/>Batalha.</h1>
        <p className="text-zinc-500 text-lg">Onde as deficiências sociais estruturais encontram resistência prática e técnica. Acompanhe e apoie nossas missões ativas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {missions.map((m, i) => {
          const progress = Math.round((m.raised / m.target) * 100);
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              key={m.id} 
              className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={m.image_url} 
                  alt={m.region} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>

              {/* Data Content */}
              <div className="p-8 flex flex-col flex-1">
                {/* Progressive Bar */}
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-accent"
                  ></motion.div>
                </div>
                
                {/* Raised / Target */}
                <div className="flex justify-between items-end mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Arrecadado / Meta</span>
                    <span className="font-mono text-zinc-950 font-bold">
                      {formatCurrency(m.raised)} / {formatCurrency(m.target)}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-accent">{progress}%</span>
                </div>

                {/* Locality */}
                <h3 className="text-xl font-bold text-zinc-950 mb-3 tracking-tight uppercase">
                  {m.region}
                </h3>

                {/* Description */}
                <div className="mb-8 flex-1">
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                    {m.description}
                  </p>
                </div>

                {/* Action Button */}
                <Link to={`/missao/${m.id}`} className="block text-center w-full mt-auto py-4 rounded-xl font-bold bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors">
                  Ler mais
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
