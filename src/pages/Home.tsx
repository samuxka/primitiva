import { motion, AnimatePresence } from 'framer-motion';
import { CaretRight, HandHeart, GlobeHemisphereWest, ShieldCheck, Phone, EnvelopeSimple, MapPinLine, BookOpen } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

// Como não consigo salvar as imagens diretamente do chat, 
// configurei o código para ler da pasta public/images/
// Por favor, salve as 4 imagens que você enviou na pasta "public/images" 
// com os nomes "hero1.jpg", "hero2.jpg", "hero3.jpg" e "hero4.jpg" (ou altere os nomes abaixo).
// Como fallback provisório, usaremos imagens do picsum se as locais não existirem.
const HERO_IMAGES = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg"
];

export const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const { error } = await supabase.from('contacts').insert([formData]);
      if (error) throw error;
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Troca a imagem a cada 5 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden">
      {/* Hero Section com Carrossel de Fundo */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
        
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImage}
              src={HERO_IMAGES[currentImage]}
              onError={(e) => {
                // Automação: Se o arquivo local ainda não existir, mostrar um placeholder temporário para não quebrar o visual
                e.currentTarget.src = `https://picsum.photos/seed/primitiva${currentImage}/1920/1080`;
              }}
              alt="Primitiva Background"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
          
          {/* Gradient Overlay para garantir a legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background z-10" />
        </div>

        <div className="px-6 max-w-7xl mx-auto w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.2 }}
              className="col-span-1 lg:col-span-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-widest text-white mb-8 bg-black/40 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Impacto Direto
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-8 select-none text-white drop-shadow-lg">
                Restaurando a<br/>
                dignidade no <br/>
                <span className="text-zinc-300 block mt-2 font-light italic">ponto zero.</span>
              </h1>
              
              <p className="text-xl text-zinc-100 max-w-[45ch] mb-12 leading-relaxed p-6 rounded-[2rem] bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10">
                Não atuamos nas margens. Entramos nas fendas mais profundas da sociedade para trazer restauração sistêmica.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link to="/doar" className="group relative inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.2)] hover:shadow-accent/40">
                  <span className="relative z-10 flex items-center gap-2">
                    Apoiar Missão <CaretRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </Link>
                <Link to="/sobre" className="text-sm font-mono tracking-widest uppercase text-zinc-300 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent hover:after:w-full after:transition-all">
                  Ler Manifesto
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="hidden lg:flex col-span-1 lg:col-span-4 flex-col justify-end items-end h-full mt-auto mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[240px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <GlobeHemisphereWest size={24} weight="fill" className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-mono">Vidas Alcançadas</p>
                    <p className="text-2xl font-bold font-mono text-white">12,847</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-6">
                  {HERO_IMAGES.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'}`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="px-6 py-32 max-w-7xl mx-auto w-full">
        <div className="mb-16 md:flex justify-between items-end">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">Nossas Frentes.</h2>
          <p className="text-zinc-500 max-w-sm mt-4 md:mt-0">Metodologias aplicadas com precisão cirúrgica em áreas de vulnerabilidade extrema.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-effect rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-14 h-14 rounded-2xl glass-effect flex items-center justify-center mb-8">
              <HandHeart size={28} className="text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Socorro Emergencial</h3>
            <p className="text-zinc-600">Intervenção rápida em crises. Levamos recursos vitais, logística e suporte humano nas primeiras 48h de ocorrências extremas.</p>
          </div>
          
          {/* Card 2 */}
          <div className="glass-effect rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl glass-effect flex items-center justify-center mb-8">
              <ShieldCheck size={28} className="text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Reconstrução</h3>
            <p className="text-zinc-600">Implementação de infraestrutura básica sustentável e desenvolvimento de microeconomias nas comunidades locais.</p>
          </div>

          {/* Card 3 - Ensino */}
          <div className="glass-effect rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl glass-effect flex items-center justify-center mb-8">
              <BookOpen size={28} className="text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ensino e Educação</h3>
            <p className="text-zinc-600">Projetos educacionais voltados à alfabetização e capacitação contínua, forjando o futuro de novas gerações.</p>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section className="px-6 py-32 max-w-7xl mx-auto w-full">
        <div className="bg-zinc-950 text-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Background decoration */}
          <div className="absolute -top-[50%] -right-[10%] w-[80%] h-[150%] bg-accent/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs uppercase tracking-widest text-white mb-8 backdrop-blur-md">
                Conexão
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">Pronto para<br/>fazer parte?</h2>
              <p className="text-zinc-400 max-w-md mb-12 text-lg">
                Seja um voluntário, parceiro ou doador. Entre em contato com a nossa base operacional para saber como você pode somar esforços.
              </p>
              
              <div className="space-y-6">
                <a href="mailto:ibm.primitiva@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                    <EnvelopeSimple size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-mono mb-1">Email</p>
                    <p className="font-medium text-white group-hover:text-accent transition-colors">ibm.primitiva@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+5575988162781" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-mono mb-1">Telefone / WhatsApp</p>
                    <p className="font-medium text-white group-hover:text-accent transition-colors">+55 (75) 988162781</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPinLine size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-mono mb-1">Base Central</p>
                    <p className="font-medium text-white">Santo Antônio de Jesus, BA - Brasil</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl relative">
              {submitStatus === 'success' && (
                <div className="absolute inset-0 bg-zinc-950/90 z-20 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center backdrop-blur-md border border-accent/30 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4">
                    <HandHeart size={32} weight="fill" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h3>
                  <p className="text-zinc-400">Recebemos o seu contato. Nossa equipe retornará o mais breve possível.</p>
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-5 relative z-10">
                <h3 className="text-2xl font-bold mb-2">Envie uma mensagem</h3>
                
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                    Ocorreu um erro ao enviar sua mensagem. Tente novamente.
                  </p>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-mono text-zinc-400 ml-2">NOME COMPLETO</label>
                  <input 
                    required
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-accent text-white placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-mono text-zinc-400 ml-2">E-MAIL</label>
                  <input 
                    required
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-accent text-white placeholder:text-zinc-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-mono text-zinc-400 ml-2">MENSAGEM</label>
                  <textarea 
                    required
                    id="message" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Como você quer se conectar conosco?"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-accent text-white placeholder:text-zinc-600 transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 flex justify-center items-center h-14 bg-accent text-black font-bold rounded-2xl hover:bg-[#00cce6] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
