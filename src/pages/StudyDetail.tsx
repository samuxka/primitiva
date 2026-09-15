import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, updateDoc, increment } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CalendarBlank, ShareNetwork, Clock, ArrowRight, Heart } from '@phosphor-icons/react';

export const StudyDetail = () => {
  const { id } = useParams();
  const [study, setStudy] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Likes State
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchStudy = async () => {
      setLoading(true);
      if (!id) return;
      
      const docRef = doc(db, 'studies', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as any;
        setStudy(data);
        setLikesCount(data.likes_count || 0);
        
        // Check local storage for like
        const likedStudies = JSON.parse(localStorage.getItem('liked_studies') || '[]');
        if (likedStudies.includes(id)) {
            setHasLiked(true);
        }

        // Fetch Recommended
        const q = query(collection(db, 'studies'), orderBy('created_at', 'desc'), limit(4));
        const recSnap = await getDocs(q);
        const recs = recSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => d.id !== id)
            .slice(0, 3);
            
        setRecommended(recs);
      }
      
      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchStudy();
  }, [id]);

  const handleLike = async () => {
      if (!id || hasLiked) return;
      
      // Update UI optimistically
      setHasLiked(true);
      setLikesCount(prev => prev + 1);
      
      // Save to local storage
      const likedStudies = JSON.parse(localStorage.getItem('liked_studies') || '[]');
      likedStudies.push(id);
      localStorage.setItem('liked_studies', JSON.stringify(likedStudies));
      
      // Update Firestore
      const docRef = doc(db, 'studies', id);
      await updateDoc(docRef, {
          likes_count: increment(1)
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex-1 w-full flex items-center justify-center bg-background">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-200 bg-white shadow-sm">
          <div className="w-4 h-4 rounded-full bg-accent animate-ping"></div>
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Carregando artigo...</span>
        </div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen flex-1 w-full flex flex-col items-center justify-center text-center px-6 bg-background">
        <div className="bg-white border border-zinc-200 p-12 rounded-[3rem] max-w-lg w-full shadow-sm">
          <h1 className="text-3xl font-bold mb-4 text-zinc-950">Artigo não encontrado</h1>
          <p className="text-zinc-500 mb-8">O conteúdo que você está procurando pode ter sido movido ou excluído.</p>
          <Link to="/estudos" className="inline-flex items-center justify-center bg-zinc-950 text-white px-6 py-3 rounded-full font-bold hover:bg-accent hover:text-black transition-all">
            Voltar para o Acervo
          </Link>
        </div>
      </div>
    );
  }

  // Estimar tempo de leitura (aprox 200 palavras por minuto)
  const wordCount = study.content ? study.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex-1 flex flex-col w-full bg-background selection:bg-accent selection:text-black">
      
      <article className="w-full relative pb-24">
        
        {/* Notion Style Banner */}
        {study.banner_url && (
            <div className="w-full h-[40vh] md:h-[50vh] relative bg-zinc-100">
                <img src={study.banner_url} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background"></div>
            </div>
        )}
        
        <div className={`px-6 max-w-4xl mx-auto w-full relative z-10 ${study.banner_url ? '-mt-24' : 'pt-32'}`}>
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-zinc-100 relative">
                
                <Link to="/estudos" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-950 hover:border-zinc-400 transition-colors font-mono text-xs uppercase tracking-widest mb-12 absolute -top-6 left-8 shadow-sm">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                    Voltar para Acervo
                </Link>

                <header className="mb-12">
                  {((study.categories && study.categories.length > 0) ? study.categories : (study.category ? [study.category] : [])).map((c:string) => (
                      <span key={c} className="inline-block px-4 py-2 rounded-lg bg-zinc-100 text-accent font-bold text-xs font-mono uppercase tracking-widest mb-6 mr-3">
                          {c}
                      </span>
                  ))}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8 text-zinc-950 leading-[1.1]">
                    {study.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-widest text-zinc-400">
                    <span className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 px-3 py-1.5 rounded-full">
                      <CalendarBlank size={14} />
                      {new Date(study.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1.5 border border-zinc-200 bg-zinc-50 px-3 py-1.5 rounded-full">
                      <Clock size={14} />
                      {readingTime} min de leitura
                    </span>
                  </div>
                </header>
                
                <div className="w-full h-px bg-zinc-200 my-12"></div>

                {/* Article Content */}
                <div className="prose prose-lg prose-zinc prose-headings:text-zinc-950 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:font-semibold hover:prose-a:text-[#00cce6] prose-p:leading-relaxed prose-p:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-900 prose-blockquote:border-accent prose-blockquote:bg-zinc-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-zinc-800 max-w-none mb-16">
                  <ReactMarkdown>{study.content}</ReactMarkdown>
                </div>
                
                {/* Footer Actions (Likes & Share) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-zinc-50 border border-zinc-200">
                    <button 
                        onClick={handleLike} 
                        disabled={hasLiked}
                        className={`group flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all shadow-sm ${hasLiked ? 'bg-red-50 text-red-500 border border-red-200 cursor-default' : 'bg-white text-zinc-950 border border-zinc-200 hover:border-red-500 hover:text-red-500 cursor-pointer'}`}
                    >
                        <Heart size={20} weight={hasLiked ? "fill" : "regular"} className={hasLiked ? "" : "group-hover:scale-110 transition-transform"} />
                        {hasLiked ? 'Você curtiu' : 'Curtir Estudo'} 
                        <span className="ml-2 font-mono bg-zinc-100 text-zinc-950 px-2 py-0.5 rounded-md text-xs">{likesCount}</span>
                    </button>

                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copiado!');
                        }}
                        className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-950 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors font-mono text-xs uppercase tracking-widest cursor-pointer shadow-sm"
                    >
                        <ShareNetwork size={16} />
                        Copiar Link
                    </button>
                </div>
            </div>
        </div>
      </article>

      {/* Recommended Studies */}
      {recommended.length > 0 && (
        <section className="bg-zinc-50 py-24 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-bold tracking-tighter text-zinc-950">
                Continue Lendo
              </h3>
              <Link to="/estudos" className="hidden sm:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-accent transition-colors">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map((s) => (
                <Link 
                  key={s.id} 
                  to={`/estudo/${s.id}`}
                  className="group block h-full"
                >
                  <article className="h-full flex flex-col bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all overflow-hidden">
                    {s.banner_url && (
                        <div className="w-full h-40 overflow-hidden relative bg-zinc-100">
                            <img src={s.banner_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-4">
                        <CalendarBlank size={14} />
                        {new Date(s.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {((s.categories && s.categories.length > 0) ? s.categories : (s.category ? [s.category] : [])).slice(0, 2).map((c:string) => (
                                <span key={c} className="text-accent text-[10px] uppercase font-bold tracking-widest font-mono block">{c}</span>
                            ))}
                        </div>
                        <h4 className="text-xl font-bold mb-4 text-zinc-950 group-hover:text-accent transition-colors tracking-tight leading-tight line-clamp-2">
                        {s.title}
                        </h4>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-zinc-900 group-hover:text-accent transition-colors">
                                Ler <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            {s.likes_count > 0 && (
                                <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                    <Heart size={14} weight="fill" /> {s.likes_count}
                                </div>
                            )}
                        </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 sm:hidden flex justify-center">
               <Link to="/estudos" className="inline-flex items-center justify-center bg-zinc-950 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all w-full text-sm">
                 Ver todo o Acervo
               </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
