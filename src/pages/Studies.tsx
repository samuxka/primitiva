import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';

export const Studies = () => {
  const [studies, setStudies] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('studies').select('*').order('created_at', { ascending: false }).then(({ data }) => setStudies(data || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 flex-1 w-full">
      <div className="mb-24">
        <h1 className="text-6xl font-bold tracking-tighter mb-6 text-zinc-950">Estudos &<br/>Artigos.</h1>
        <p className="text-zinc-500 text-lg">Acervo técnico, análises sociopolíticas e relatos de campo formados por nossa inteligência local.</p>
      </div>

      <div className="space-y-12">
        {studies.map((s: any) => (
          <article key={s.id} className="pb-12 border-b border-zinc-200">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4 block">
              {new Date(s.created_at).toLocaleDateString('pt-BR')}
            </span>
            <h2 className="text-3xl font-bold mb-6 hover:text-accent transition-colors cursor-pointer tracking-tight">
              {s.title}
            </h2>
            <div className="text-zinc-600 leading-relaxed text-lg line-clamp-4">
              <ReactMarkdown>{s.content}</ReactMarkdown>
            </div>
            <button className="mt-8 font-mono text-xs uppercase tracking-widest font-bold hover:text-accent flex items-center gap-2">
              Ler Estudo Completo →
            </button>
          </article>
        ))}
      </div>

      {studies.length === 0 && (
        <div className="text-center w-full py-20 bg-zinc-100 rounded-3xl text-zinc-400 font-mono text-sm uppercase mt-12">Nenhum estudo publicado no Admin.</div>
      )}
    </div>
  );
};
