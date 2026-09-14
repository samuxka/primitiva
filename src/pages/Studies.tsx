import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, CalendarBlank, MagnifyingGlass, Heart, CaretLeft, CaretRight } from '@phosphor-icons/react';

export const Studies = () => {
  const [studies, setStudies] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'studies'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setStudies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredStudies = studies.filter(s => {
      if (!search) return true;
      const term = search.toLowerCase();
      const catsMatch = Array.isArray(s.categories) 
          ? s.categories.some((c: string) => c.toLowerCase().includes(term))
          : (s.category || '').toLowerCase().includes(term);
      return (
          (s.title || '').toLowerCase().includes(term) ||
          (s.content || '').toLowerCase().includes(term) ||
          catsMatch
      );
  });

  const topCarousel = filteredStudies.slice(0, 5);
  const latestStudies = filteredStudies.slice(0, 5);
  const mostLiked = [...filteredStudies].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0)).slice(0, 5);

  const nextSlide = () => setCarouselIdx((prev) => (prev + 1) % topCarousel.length);
  const prevSlide = () => setCarouselIdx((prev) => (prev - 1 + topCarousel.length) % topCarousel.length);

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden bg-background">
      {/* Header & Search */}
      <section className="pt-40 pb-12 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-widest text-zinc-600 mb-8 glass-effect border border-zinc-200">
          <BookOpen size={14} className="text-accent" />
          Acervo Primitiva
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-zinc-950">
          Estudos & Artigos.
        </h1>
        
        <div className="relative max-w-2xl">
           <MagnifyingGlass size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
           <input 
              type="text" 
              placeholder="Pesquisar por título, assunto ou categoria..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-full pl-16 pr-6 py-5 text-lg shadow-sm focus:outline-none focus:border-zinc-400 focus:shadow-md transition-all text-zinc-950 placeholder:text-zinc-400"
           />
        </div>
      </section>

      <section className="px-6 pb-32 max-w-7xl mx-auto w-full relative z-10 space-y-24">
        {filteredStudies.length === 0 ? (
           <div className="text-center w-full py-32 glass-effect rounded-[3rem] text-zinc-400 font-mono text-sm uppercase flex flex-col items-center justify-center gap-4 border border-zinc-200">
             <BookOpen size={48} className="text-zinc-300" />
             Nenhum estudo encontrado.
           </div>
        ) : (
          <>
            {/* Carousel Section */}
            {topCarousel.length > 0 && !search && (
              <div className="relative w-full rounded-[3rem] overflow-hidden bg-zinc-950 text-white min-h-[500px] flex items-center shadow-xl group">
                 {topCarousel.map((study, idx) => (
                    <div 
                        key={study.id} 
                        className={`absolute inset-0 transition-opacity duration-1000 ${idx === carouselIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {study.banner_url && (
                            <div className="absolute inset-0 w-full h-full">
                               <img src={study.banner_url} className="w-full h-full object-cover opacity-40" />
                               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
                            </div>
                        )}
                        <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-16 max-w-4xl">
                            {((study.categories && study.categories.length > 0) ? study.categories : (study.category ? [study.category] : [])).slice(0, 3).map((c:string) => (
                                <span key={c} className="inline-block text-accent font-mono text-xs uppercase tracking-widest font-bold mb-4 mr-3">{c}</span>
                            ))}
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight drop-shadow-lg">{study.title}</h2>
                            <Link to={`/estudo/${study.id}`} className="inline-flex items-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-full font-bold max-w-max hover:scale-105 transition-transform uppercase text-sm tracking-wide">
                                Ler Estudo Completo <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                 ))}
                 
                 {topCarousel.length > 1 && (
                     <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/20"><CaretLeft size={24} weight="bold"/></button>
                         <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/20"><CaretRight size={24} weight="bold"/></button>
                     </div>
                 )}
                 
                 {topCarousel.length > 1 && (
                     <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                         {topCarousel.map((_, i) => (
                             <button key={i} onClick={() => setCarouselIdx(i)} className={`w-3 h-3 rounded-full transition-all ${i === carouselIdx ? 'bg-accent scale-125' : 'bg-white/30 hover:bg-white/60'}`}></button>
                         ))}
                     </div>
                 )}
              </div>
            )}

            {/* Horizontal Cards: Últimos Estudos */}
            {latestStudies.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-950 mb-8 border-b border-zinc-200 pb-4">Últimos Estudos</h3>
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                        {latestStudies.map((s: any) => (
                            <Link key={s.id} to={`/estudo/${s.id}`} className="shrink-0 w-80 sm:w-96 snap-start group border border-zinc-200 bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all">
                                {s.banner_url ? (
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={s.banner_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-zinc-100 flex items-center justify-center border-b border-zinc-200">
                                        <BookOpen size={48} className="text-zinc-300" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {((s.categories && s.categories.length > 0) ? s.categories : (s.category ? [s.category] : [])).slice(0, 2).map((c:string) => (
                                                <span key={c} className="text-accent text-[10px] uppercase font-bold tracking-widest font-mono">{c}</span>
                                            ))}
                                        </div>
                                        <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
                                            <CalendarBlank size={12}/> {new Date(s.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg leading-snug text-zinc-950 group-hover:text-accent transition-colors line-clamp-2">{s.title}</h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Mais Curtidos */}
            {mostLiked.length > 0 && !search && (
                <div>
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 pb-4">
                        <Heart size={24} weight="fill" className="text-red-500" />
                        <h3 className="text-2xl font-bold tracking-tight text-zinc-950">Mais Curtidos</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mostLiked.map((s: any) => (
                            <Link key={s.id} to={`/estudo/${s.id}`} className="group block bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-lg transition-all flex flex-col h-full">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {((s.categories && s.categories.length > 0) ? s.categories : (s.category ? [s.category] : [])).slice(0, 2).map((c:string) => (
                                        <span key={c} className="text-accent text-[10px] uppercase font-bold tracking-widest font-mono block">{c}</span>
                                    ))}
                                </div>
                                <h4 className="font-bold text-xl leading-tight text-zinc-950 group-hover:text-accent transition-colors line-clamp-2 mb-4">{s.title}</h4>
                                <div className="text-zinc-500 text-sm line-clamp-3 mb-6">
                                    <ReactMarkdown>{s.content}</ReactMarkdown>
                                </div>
                                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                                    <span className="flex items-center gap-2 text-red-500 font-bold text-sm">
                                        <Heart size={16} weight="fill" /> {s.likes_count || 0}
                                    </span>
                                    <span className="text-zinc-400 group-hover:text-zinc-950 transition-colors"><ArrowRight size={20} /></span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
          </>
        )}
      </section>
    </div>
  );
};
