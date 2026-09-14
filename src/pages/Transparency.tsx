import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const Transparency = () => {
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setTxs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 flex-1 w-full relative">
      <div className="mb-32">
        <h1 className="text-6xl font-bold tracking-tighter mb-6 text-zinc-950 uppercase">Extrato <br/>Aberto.</h1>
        <p className="text-zinc-600 text-lg max-w-xl font-mono text-sm">
          Acesso público ao fluxo primário de capital. Transparência técnica. Cockpit Mode ativo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {txs.map((t: any) => (
          <div key={t.id} className="bg-white border border-zinc-200 p-8 rounded-3xl hover:border-zinc-300 hover:shadow-xl transition-all group flex flex-col items-start justify-between min-h-[250px] relative overflow-hidden">
             
            <div className="z-10 w-full mb-8">
              <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold mb-6">
                {t.tx_date}
              </span>
              <h2 className="text-2xl font-bold font-sans text-zinc-950 group-hover:text-accent transition-colors leading-tight">
                {t.description}
              </h2>
            </div>
            
            <a 
               href={t.amount} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="z-10 w-full bg-zinc-950 text-white font-bold py-4 px-6 rounded-xl flex justify-between items-center group-hover:bg-accent transition-colors"
            >
               <span>Baixar Relatório</span>
               <span className="font-mono text-xs opacity-70 border border-white/20 px-2 py-1 rounded">PDF</span>
            </a>
            
            {/* Minimal aesthetics background logo abstraction */}
            <div className="absolute -bottom-12 -right-12 text-[150px] font-black text-zinc-50 opacity-50 pointer-events-none group-hover:-rotate-12 transition-transform duration-700">
              $
            </div>
          </div>
        ))}
        {txs.length === 0 && (
          <div className="col-span-full text-center py-32 text-zinc-400 font-mono text-sm uppercase">Acervo Fiduciário Vazio.</div>
        )}
      </div>
    </div>
  );
};
