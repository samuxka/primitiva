import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMissions } from '../context/MissionsContext';
import { useCurrency } from '../context/CurrencyContext';
import ReactMarkdown from 'react-markdown';

export const MissionDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { missions, addDonation } = useMissions();
  const { currencyCode, formatCurrency, convertToBRL, loading: currencyLoading } = useCurrency();
  const mission = missions.find(m => m.id === id);
  
  const [amount, setAmount] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    if (missions.length > 0 && !currencyLoading && searchParams.get('success') === 'true' && searchParams.get('amount')) {
      const donatedAmountLocal = Number(searchParams.get('amount'));
      // Re-convert back to BRL for the local database consistency logic
      const donatedAmountBrl = Math.round(convertToBRL(donatedAmountLocal)); 
      addDonation(id as string, donatedAmountBrl);
      setDonationSuccess(true);
      // Clean up url
      setSearchParams({});
    }
  }, [searchParams, id, missions.length, currencyLoading]);

  if (!mission) {
    return <div className="text-center py-32 text-zinc-950 font-bold text-2xl">Missão não encontrada.</div>;
  }

  const progress = Math.min(100, Math.round((mission.raised / mission.target) * 100));

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const resp = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          missionId: mission.id,
          missionTitle: mission.region,
          currencyCode
        })
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao instanciar checkout: " + (data.error || "Desconhecido"));
      }
    } catch (e) {
      alert("Erro ao conectar ao backend de pagamento.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex-1 w-full flex flex-col items-center">
      
      {/* Detail Layout */}
      <div className="w-full max-w-5xl">
        {donationSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-emerald-100 border border-emerald-300 text-emerald-900 p-6 rounded-2xl mb-8 flex items-center justify-center font-bold"
          >
            Sua doação foi computada com sucesso! A comunidade agradece imensamente.
          </motion.div>
        )}

        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden shadow-sm mb-12"
        >
          <img src={mission.image_url} alt={mission.region} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase">{mission.region}</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Mission Explanation Context */}
          <div className="lg:col-span-2 space-y-6 text-zinc-600 text-lg leading-relaxed">
            <ReactMarkdown components={{
              h1: ({...props}) => <h1 className="text-3xl font-bold text-zinc-950 mb-6" {...props}/>,
              h2: ({...props}) => <h2 className="text-2xl font-bold text-zinc-950 mb-4 mt-8" {...props}/>,
              p: ({...props}) => <p className="mb-6 leading-relaxed" {...props}/>,
              ul: ({...props}) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props}/>,
              ol: ({...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props}/>,
              a: ({...props}) => <a className="text-accent font-bold hover:underline" {...props}/>,
              strong: ({...props}) => <strong className="font-bold text-zinc-900" {...props}/>,
            }}>
              {mission.description}
            </ReactMarkdown>
            
            <hr className="my-10 border-zinc-200" />
            <p>
              Nossa abordagem para "{mission.region}" visa ir além da assistência temporária. Planejamos a construção
              e a solidificação de uma base que garanta o autodesenvolvimento da comunidade logo após o término
              físico do projeto.
            </p>
            <p>
              Em nossos relatórios passados, identificamos que a carência na estrutura primária é a principal causa da
              incidência mortuária e falta de oportunidades produtivas localmente. Seu apoio garante a etapa crucial do desenvolvimento.
            </p>
          </div>

          {/* Donation Box Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 sticky top-24 shadow-sm flex flex-col">
              <h2 className="text-xl font-bold text-zinc-950 tracking-tight mb-6">Resumo da Arrecadação</h2>
              
              {/* Progress Bar Visuals */}
              <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                  className="h-full bg-accent relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/30 animate-pulse"></div>
                </motion.div>
              </div>
              
              {/* Amounts */}
              <div className="flex justify-between items-end mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">Arrecadado / Meta</span>
                  <span className="font-mono text-zinc-950 font-bold text-lg">
                    {formatCurrency(mission.raised)} / {formatCurrency(mission.target)}
                  </span>
                </div>
                <span className="text-xl font-mono font-bold text-accent">{progress}%</span>
              </div>

              {/* Checkout Form */}
              <div className="mt-4 border-t border-zinc-100 pt-6">
                <label className="text-xs uppercase tracking-widest font-mono text-zinc-500 mb-4 block">Apoiar Missão (R$)</label>
                <div className="flex bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-6 focus-within:border-accent transition-colors">
                   <span className="pl-4 py-4 font-mono text-zinc-400 font-bold">
                     {currencyCode === 'BRL' ? 'R$' : currencyCode === 'EUR' ? '€' : currencyCode}
                   </span>
                   <input 
                     type="number" 
                     value={amount || ''}
                     onChange={(e) => setAmount(Number(e.target.value))}
                     className="w-full bg-transparent p-4 outline-none font-mono font-bold text-zinc-950 text-xl"
                   />
                </div>
                
                <button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="relative w-full overflow-hidden bg-zinc-950 text-white font-bold py-5 rounded-2xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Redirecionando...' : 'Doar Agora via Stripe'}
                  </span>
                  <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </button>
                <p className="text-center text-[10px] font-mono text-zinc-400 mt-4 uppercase tracking-widest">
                  Secure Checkout
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
