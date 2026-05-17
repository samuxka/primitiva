import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useMissions } from '../context/MissionsContext';
import MDEditor from '@uiw/react-md-editor';


// Basic Login Gate Component
const AdminAuthGuard = ({ children }: { children: any }) => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuth(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="min-h-[100dvh] bg-zinc-50 flex items-center justify-center"><p className="font-mono text-sm tracking-widest uppercase text-zinc-500 animate-pulse">Carregando...</p></div>;

  if (isAuth) return children;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd
    });

    if (error) {
      setErr(error.message === 'Invalid login credentials' ? 'Email ou Senha Incorretos' : error.message);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-50 w-full absolute inset-0 z-[100]">
      <form onSubmit={handleSubmit} className="bg-white p-12 rounded-3xl border border-zinc-200 text-center shadow-lg w-full max-w-sm tracking-tight text-zinc-950">
        <h1 className="text-2xl font-bold font-mono text-zinc-950 mb-6 uppercase tracking-widest text-center">Admin Access</h1>
        <input 
          type="email" 
          autoFocus 
          placeholder="E-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-zinc-100 border border-zinc-200 outline-none focus:border-zinc-500 rounded-xl px-4 py-3 mb-4 tracking-wide font-sans text-sm"
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={pwd} 
          onChange={e => setPwd(e.target.value)}
          className="w-full bg-zinc-100 border border-zinc-200 outline-none focus:border-zinc-500 rounded-xl px-4 py-3 mb-4 tracking-widest font-mono text-sm"
        />
        {err && <p className="text-red-500 text-xs mb-4 uppercase">{err}</p>}
        <button className="w-full bg-zinc-950 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Entrar</button>
      </form>
    </div>
  );
};

export const Admin = () => {
  const [tab, setTab] = useState('Overview');
  
  return (
    <AdminAuthGuard>
      <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-zinc-50 text-zinc-900 font-sans z-50 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-zinc-200 p-4 md:p-6 flex flex-col shrink-0 h-auto md:h-full z-10">
          <div className="flex justify-between items-center mb-4 md:mb-12">
            <h2 className="text-xl font-bold uppercase tracking-tighter">Painel de <br className="hidden md:block"/><span className="text-accent">Controle.</span></h2>
            <button 
              onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
              className="md:hidden text-red-500 font-mono text-xs uppercase tracking-widest hover:bg-red-50 px-3 py-2 rounded-lg"
            >Sair</button>
          </div>
          <nav className="flex md:flex-col gap-2 font-mono text-sm overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['Overview', 'Missões', 'Galeria', 'Transparência', 'Estudos', 'Mensagens'].map(t => (
              <button 
                key={t} 
                onClick={() => setTab(t)}
                className={`text-left px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${tab === t ? 'bg-zinc-950 text-white font-semibold' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
              >
                {t}
              </button>
            ))}
          </nav>
          <button 
            onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
            className="hidden md:block mt-auto text-left px-4 py-3 text-red-500 font-mono text-xs uppercase tracking-widest hover:bg-red-50 rounded-lg"
          >Sair</button>
        </aside>

        {/* Dynamic Content */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          {tab === 'Overview' && <OverviewTab />}
          {tab === 'Missões' && <MissionsTab />}
          {tab === 'Galeria' && <GalleryTab />}
          {tab === 'Transparência' && <TransparencyTab />}
          {tab === 'Estudos' && <StudiesTab />}
          {tab === 'Mensagens' && <MessagesTab />}
        </main>
      </div>
    </AdminAuthGuard>
  );
};

// Sub-components logic
const OverviewTab = () => {
  const { missions } = useMissions();
  const totalRaised = missions.reduce((acc, curr) => acc + curr.raised, 0);
  
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold tracking-tight mb-8">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-2">Total Arrecadado</p>
          <p className="text-4xl font-mono text-emerald-500">R$ {totalRaised.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-zinc-200">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-2">Missões Ativas</p>
          <p className="text-4xl font-mono">{missions.length}</p>
        </div>
      </div>
    </div>
  );
};

const MissionsTab = () => {
  const { missions, refreshMissions } = useMissions();
  const [form, setForm] = useState({ region: '', description: '', target: '', image_url: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpload = async (file: File) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setUploadingImage(false);
      
      if (!res.ok || data.error) throw new Error(data.error || 'Erro no servidor de imagens');
      if (!data.secure_url) throw new Error('Servidor não retornou a URL da imagem');
      
      return data.secure_url;
    } catch (e: any) {
      setUploadingImage(false);
      alert('Erro no upload: ' + e.message);
      return null;
    }
  };

  const createMission = async (e: any) => {
    e.preventDefault();
    await supabase.from('missions').insert({
      region: form.region, description: form.description, target: Number(form.target), image_url: form.image_url
    });
    setForm({ region: '', description: '', target: '', image_url: '' });
    refreshMissions();
  };

  const deleteMission = async (id: string) => {
    await supabase.from('missions').delete().eq('id', id);
    refreshMissions();
  };

  return (
    <div className="animate-in fade-in">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Missões</h1>
      
      <form onSubmit={createMission} className="bg-white p-6 rounded-2xl border border-zinc-200 mb-8 grid grid-cols-2 gap-4">
        <input required placeholder="Região" value={form.region} onChange={e=>setForm({...form, region: e.target.value})} className="border p-3 rounded-lg" />
        <input required type="number" placeholder="Alvo R$" value={form.target} onChange={e=>setForm({...form, target: e.target.value})} className="border p-3 rounded-lg font-mono" />
        
        <div className="col-span-2 relative">
          <input 
             required={!form.image_url} 
             title="Upload de Imagem"
             type="file" 
             accept="image/*" 
             onChange={async (e) => {
               const f = e.target.files?.[0];
               if(f) {
                 const url = await handleUpload(f);
                 if(url) setForm({...form, image_url: url});
               }
             }} 
             className="hidden" 
             id="mission-image" 
          />
          <label htmlFor="mission-image" className="cursor-pointer border-2 border-dashed border-zinc-300 p-4 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-500 hover:border-zinc-950 transition-colors w-full h-16">
            {uploadingImage ? 'Enviando ao Servidor...' : form.image_url ? 'Imagem Pronta! (Clique para substituir)' : 'Carregar Imagem da Missão (Upload)'}
          </label>
        </div>

        <div className="col-span-2" data-color-mode="light">
          <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Descrição Longa (Markdown)</label>
          <MDEditor value={form.description} onChange={val=>setForm({...form, description: val || ''})} height={200} />
        </div>
        <button type="submit" className="col-span-2 bg-zinc-950 text-white p-4 rounded-xl font-bold hover:opacity-90">Criar Missão</button>
      </form>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200 font-mono text-zinc-500 uppercase text-xs tracking-wider">
            <tr><th className="p-4">Região</th><th className="p-4">Arrecadado</th><th className="p-4">Ação</th></tr>
          </thead>
          <tbody>
            {missions.map(m => (
              <tr key={m.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="p-4 font-semibold">{m.region}</td>
                <td className="p-4 font-mono text-emerald-600">R$ {m.raised.toLocaleString('pt-BR')}</td>
                <td className="p-4"><button onClick={() => deleteMission(m.id!)} className="text-red-500 uppercase text-xs font-bold hover:underline">Deletar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GalleryTab = () => {
  const [images, setImages] = useState<any[]>([]);
  const [pendingMedia, setPendingMedia] = useState<{url: string, type: string}[]>([]);
  const [albumName, setAlbumName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // For Album Navigation in Admin
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  
  // For Album Metadata
  const [albumMeta, setAlbumMeta] = useState({ description: '', date: '', location: '' });
  const [savingMeta, setSavingMeta] = useState(false);

  useEffect(() => {
    if (selectedAlbum) {
      supabase.from('albums_meta').select('*').eq('name', selectedAlbum).single().then(({ data }) => {
        if (data) {
          setAlbumMeta({ 
            description: data.description || '', 
            date: data.date || '', 
            location: data.location || '' 
          });
        } else {
          setAlbumMeta({ description: '', date: '', location: '' });
        }
      });
    }
  }, [selectedAlbum]);

  const saveAlbumMeta = async (e: any) => {
    e.preventDefault();
    setSavingMeta(true);
    try {
      await supabase.from('albums_meta').upsert({
        name: selectedAlbum,
        description: albumMeta.description,
        date: albumMeta.date,
        location: albumMeta.location
      });
      alert('Metadados do álbum salvos com sucesso!');
    } catch (err) {
      alert('Erro ao salvar metadados.');
    }
    setSavingMeta(false);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      
      if (!res.ok || data.error) throw new Error(data.error || 'Erro no servidor de imagens');
      if (!data.secure_url) throw new Error('Servidor não retornou a URL da imagem');
      
      return data.secure_url;
    } catch (e: any) {
      alert('Erro no upload da foto/vídeo (' + file.name + '): ' + e.message);
      return null;
    }
  };

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setImages(data);
  };
  
  useEffect(() => { fetchImages(); }, []);

  const addImages = async (e: any) => {
    e.preventDefault();
    if(pendingMedia.length === 0 || !albumName) return alert('Selecione arquivos e insira o nome do álbum.');
    const inserts = pendingMedia.map(m => ({ 
      image_url: m.url, 
      media_type: m.type,
      album_name: albumName 
    }));
    await supabase.from('gallery').insert(inserts);
    setPendingMedia([]);
    setAlbumName('');
    fetchImages();
  };

  const removeImage = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await supabase.from('gallery').delete().eq('id', id);
    fetchImages();
  };

  const renameAlbum = async (oldName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newName = prompt(`Qual o novo nome do álbum "${oldName}"?`, oldName);
    if (!newName || newName === oldName) return;
    
    if(oldName === 'Sem Álbum') {
        await supabase.from('gallery').update({ album_name: newName }).is('album_name', null);
        await supabase.from('gallery').update({ album_name: newName }).eq('album_name', '');
    } else {
        await supabase.from('gallery').update({ album_name: newName }).eq('album_name', oldName);
    }

    fetchImages();
    if (selectedAlbum === oldName) setSelectedAlbum(newName);
  };

  const deleteAlbum = async (name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if(!confirm(`⚠️ DELETAR ÁLBUM: Tem certeza que deseja apagar o álbum "${name}" inteiramente com todas as contas mídias? Essa ação é IRREVERSÍVEL!`)) return;
    
    if(name === 'Sem Álbum') {
        await supabase.from('gallery').delete().is('album_name', null);
        await supabase.from('gallery').delete().eq('album_name', '');
    } else {
        await supabase.from('gallery').delete().eq('album_name', name);
    }

    fetchImages();
    if (selectedAlbum === name) setSelectedAlbum(null);
  };

  const albums = images.reduce((acc: any, item: any) => {
    const album = item.album_name || 'Sem Álbum';
    if (!acc[album]) acc[album] = [];
    acc[album].push(item);
    return acc;
  }, {});

  const albumNames = Object.keys(albums);

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Galeria (Álbuns e Mídias)</h1>
      </div>

      {!selectedAlbum && (
        <form onSubmit={addImages} className="flex flex-col gap-4 mb-8 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <input 
            required 
            placeholder="Nome do Álbum (Dica: Digite um álbum existente para enviar para ele, ou um novo para criar)" 
            value={albumName} 
            onChange={e=>setAlbumName(e.target.value)} 
            className="border p-3 rounded-xl font-bold w-full outline-none focus:border-zinc-500 transition-colors" 
          />
          <div className="flex gap-4">
              <input 
                title="Upload de Fotos e Vídeos"
                type="file" 
                accept="image/*,video/*" 
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if(files && files.length > 0) {
                    setUploadingImage(true);
                    const newMedia: {url: string, type: string}[] = [];
                    for(let i = 0; i < files.length; i++) {
                      const f = files[i];
                      const u = await handleUpload(f);
                      if(u) {
                          const type = f.type.startsWith('video') ? 'video' : 'image';
                          newMedia.push({ url: u, type });
                      }
                    }
                    setPendingMedia(prev => [...prev, ...newMedia]);
                    setUploadingImage(false);
                    e.target.value = '';
                  }
                }} 
                className="hidden" 
                id="gallery-image" 
              />
              <label htmlFor="gallery-image" className="cursor-pointer border border-zinc-200 p-3 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-500 hover:border-zinc-950 transition-colors flex-1 bg-zinc-50">
                {uploadingImage ? 'Enviando pra nuvem...' : pendingMedia.length > 0 ? `${pendingMedia.length} arquivo(s) pronto(s)! (Clique para mais)` : 'Selecione Fotos ou Vídeos'}
              </label>
              <button type="submit" disabled={pendingMedia.length === 0 || uploadingImage || !albumName} className="bg-zinc-950 text-white px-6 font-bold rounded-xl disabled:opacity-50 transition-opacity">
                Publicar no Álbum
              </button>
          </div>
        </form>
      )}
      
      {!selectedAlbum ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Gerenciar Álbuns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {albumNames.length === 0 && <p className="col-span-full text-zinc-400 font-mono text-sm py-8 uppercase tracking-widest text-center border border-dashed border-zinc-300 rounded-3xl">Nenhum álbum criado.</p>}
                
                {albumNames.map(album => {
                    const cover = albums[album][0];
                    const numItems = albums[album].length;
                    
                    return (
                       <div key={album} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden group hover:border-zinc-400 transition-colors shadow-sm flex flex-col">
                           <div className="aspect-video relative bg-zinc-100 overflow-hidden cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                                {cover.media_type === 'video' ? (
                                    <video src={cover.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" muted playsInline />
                                ) : (
                                    <img src={cover.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold tracking-widest text-xs uppercase bg-black/50 px-4 py-2 rounded-full border border-white/20">Ver Mídias</span>
                                </div>
                           </div>
                           <div className="p-4 flex-1 flex flex-col">
                               <h3 className="font-bold text-lg text-zinc-950 mb-1">{album}</h3>
                               <p className="text-xs uppercase tracking-widest font-mono text-zinc-500 mb-4">{numItems} {numItems === 1 ? 'mídia' : 'mídias'}</p>
                               
                               <div className="flex items-center gap-2 mt-auto">
                                   <button onClick={(e) => renameAlbum(album, e)} className="flex-1 bg-zinc-100 text-zinc-950 font-bold text-[10px] uppercase tracking-wider py-2 rounded-lg hover:bg-zinc-200 transition-colors">Renomear</button>
                                   <button onClick={(e) => deleteAlbum(album, e)} className="flex-1 bg-red-50 text-red-600 font-bold text-[10px] uppercase tracking-wider py-2 rounded-lg hover:bg-red-100 transition-colors">Apagar Tudo</button>
                               </div>
                           </div>
                       </div> 
                    );
                })}
            </div>
          </div>
      ) : (
          <div>
            <button onClick={() => setSelectedAlbum(null)} className="flex items-center font-bold text-sm tracking-widest uppercase text-zinc-500 hover:text-zinc-950 transition-colors border border-zinc-200 px-6 py-2 rounded-full mb-8">
                ← Voltar para Álbuns
            </button>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Conteúdo: <span className="text-zinc-500">{selectedAlbum}</span></h2>
                <button 
                  onClick={() => { setSelectedAlbum(null); setAlbumName(selectedAlbum); }} 
                  className="text-sm border-b border-black font-bold text-zinc-950 pb-1 hover:text-accent hover:border-accent transition-colors"
                >
                    + Adicionar mídias aqui
                </button>
            </div>

            <form onSubmit={saveAlbumMeta} className="bg-white p-6 rounded-2xl border border-zinc-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 flex flex-col gap-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Data do Evento/Álbum</label>
                   <input value={albumMeta.date} onChange={e=>setAlbumMeta({...albumMeta, date: e.target.value})} placeholder="Ex: 15 de Outubro, 2026" className="border border-zinc-200 p-3 rounded-xl focus:border-zinc-500 outline-none" />
                </div>
                <div className="col-span-1 flex flex-col gap-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Local</label>
                   <input value={albumMeta.location} onChange={e=>setAlbumMeta({...albumMeta, location: e.target.value})} placeholder="Ex: Comunidade Nova Esperança" className="border border-zinc-200 p-3 rounded-xl focus:border-zinc-500 outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição Breve</label>
                   <textarea value={albumMeta.description} onChange={e=>setAlbumMeta({...albumMeta, description: e.target.value})} placeholder="Escreva um pequeno resumo sobre as ações deste álbum..." rows={3} className="border border-zinc-200 p-3 rounded-xl focus:border-zinc-500 outline-none resize-none"></textarea>
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end">
                   <button type="submit" disabled={savingMeta} className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50">
                       {savingMeta ? 'Salvando...' : 'Salvar Detalhes do Álbum'}
                   </button>
                </div>
            </form>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {albums[selectedAlbum].map((img: any) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-zinc-200 bg-zinc-100 flex flex-col justify-end">
                    {img.media_type === 'video' ? (
                        <video src={img.image_url} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline controls />
                    ) : (
                        <img src={img.image_url} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => removeImage(img.id, e)} className="text-white bg-red-600/80 hover:bg-red-500 px-3 py-1 rounded-md text-xs uppercase tracking-widest font-bold font-mono shadow-lg">Remover</button>
                    </div>

                    {img.media_type === 'video' && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-widest backdrop-blur-md pointer-events-none">Vídeo</div>
                    )}
                </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

const TransparencyTab = () => {
  const [txs, setTxs] = useState<any[]>([]);
  const [form, setForm] = useState({ date: '', title: '' });
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpload = async (file: File) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setUploadingImage(false);
      
      if (!res.ok || data.error) throw new Error(data.error || 'Erro no servidor de PDF');
      if (!data.secure_url) throw new Error('Servidor não retornou a URL do PDF');
      
      return data.secure_url;
    } catch (e: any) {
      setUploadingImage(false);
      alert('Erro Crítico no Upload: ' + e.message);
      return null;
    }
  };

  const fetchTxs = async () => {
    const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (data) setTxs(data);
  };
  useEffect(() => { fetchTxs(); }, []);

  const addTx = async (e: any) => {
    e.preventDefault();
    if(!pdfUrl) return alert("Faça o upload do PDF primeiro.");
    await supabase.from('transactions').insert([{ 
      tx_date: form.date, description: form.title, amount: pdfUrl, is_positive: true 
    }]);
    setForm({ date: '', title: ''});
    setPdfUrl('');
    fetchTxs();
  };

  const removeTx = async (id: string) => {
      await supabase.from('transactions').delete().eq('id', id);
      fetchTxs();
  };

  return (
    <div className="animate-in fade-in">
      <h1 className="text-3xl font-bold mb-6">Relatórios de Transparência (PDF)</h1>
      <form onSubmit={addTx} className="bg-white p-6 rounded-2xl border border-zinc-200 mb-8 grid grid-cols-2 gap-4">
        <input required placeholder="Mês/Ano (ex: Outubro 2026)" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="col-span-1 border p-3 rounded-xl font-bold" />
        <input required placeholder="Título (ex: Balanço Trimestral)" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="col-span-1 border p-3 rounded-xl font-bold" />
        
        <div className="col-span-2 relative">
          <input 
             title="Upload de PDF"
             type="file" 
             accept=".pdf,application/pdf" 
             onChange={async (e) => {
               const f = e.target.files?.[0];
               if(f) {
                 const url = await handleUpload(f);
                 if(url) setPdfUrl(url);
               }
             }} 
             className="hidden" 
             id="pdf-upload" 
          />
          <label htmlFor="pdf-upload" className="cursor-pointer border-2 border-dashed border-zinc-300 p-4 rounded-xl flex items-center justify-center text-sm font-bold text-zinc-500 hover:border-zinc-950 transition-colors w-full h-16 bg-zinc-50">
            {uploadingImage ? 'Enviando PDF para Nuvem...' : pdfUrl ? 'PDF Anexado! (Pronto para publicar)' : 'Anexar Arquivo PDF'}
          </label>
        </div>
        <button type="submit" disabled={!pdfUrl || uploadingImage} className="col-span-2 bg-zinc-950 text-white p-4 rounded-xl font-bold disabled:opacity-50">Publicar Balanço</button>
      </form>
      
      <div className="space-y-4">
        {txs.map(tx => (
          <div key={tx.id} className="bg-white p-6 rounded-2xl border border-zinc-200 flex justify-between items-center hover:border-zinc-300 transition-colors">
            <div>
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{tx.tx_date}</p>
              <h2 className="font-bold text-lg">{tx.description}</h2>
            </div>
            <div className="flex items-center gap-4">
              <a href={tx.amount} target="_blank" rel="noopener noreferrer" className="bg-zinc-100 px-4 py-2 rounded-lg font-bold text-sm text-zinc-900 hover:bg-zinc-200">Baixar PDF</a>
              <button className="text-red-500 text-xs font-bold uppercase hover:underline" onClick={() => removeTx(tx.id)}>Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudiesTab = () => {
    const [studies, setStudies] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', content: '' });

    const fetchStudies = async () => {
      const { data } = await supabase.from('studies').select('*').order('created_at', { ascending: false });
      if (data) setStudies(data);
    };
    useEffect(() => { fetchStudies(); }, []);
  
    const addStudy = async (e: any) => {
      e.preventDefault();
      await supabase.from('studies').insert([{ title: form.title, content: form.content }]);
      setForm({ title: '', content: '' });
      fetchStudies();
    };

    const removeStudy = async (id: string) => {
        await supabase.from('studies').delete().eq('id', id);
        fetchStudies();
    }
  
    return (
      <div className="animate-in fade-in">
        <h1 className="text-3xl font-bold mb-6">Estudos Publicados</h1>
        <form onSubmit={addStudy} className="bg-white p-6 rounded-2xl border border-zinc-200 mb-8 flex flex-col gap-4">
          <input required placeholder="Título do Estudo" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="border p-3 rounded-xl text-lg font-bold outline-none focus:border-zinc-500" />
          <div data-color-mode="light">
            <MDEditor value={form.content} onChange={val=>setForm({...form, content: val || ''})} height={350} />
          </div>
          <button type="submit" className="bg-zinc-950 text-white p-4 rounded-xl font-bold hover:opacity-90 mt-2">Publicar Estudo</button>
        </form>

        <div className="space-y-4">
            {studies.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-2xl border border-zinc-200">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold">{s.title}</h2>
                        <button className="text-red-500 text-xs font-bold uppercase hover:underline" onClick={() => removeStudy(s.id)}>Deletar</button>
                    </div>
                    <p className="text-zinc-600 line-clamp-3">{s.content}</p>
                </div>
            ))}
        </div>
      </div>
    );
};

const MessagesTab = () => {
    const [messages, setMessages] = useState<any[]>([]);

    const fetchMessages = async () => {
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (data) setMessages(data);
    };
    useEffect(() => { fetchMessages(); }, []);

    const removeMessage = async (id: string) => {
        if(!confirm('Apagar esta mensagem?')) return;
        await supabase.from('contacts').delete().eq('id', id);
        fetchMessages();
    }
  
    return (
      <div className="animate-in fade-in">
        <h1 className="text-3xl font-bold mb-6">Mensagens Recebidas</h1>

        <div className="space-y-4">
            {messages.length === 0 && <p className="text-zinc-500 font-mono text-sm py-8 uppercase tracking-widest text-center border border-dashed border-zinc-300 rounded-3xl">Nenhuma mensagem no momento.</p>}
            
            {messages.map(m => (
                <div key={m.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-colors">
                    <div className="w-1 h-full bg-accent absolute left-0 top-0"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                           <h2 className="text-xl font-bold">{m.name}</h2>
                           <a href={`mailto:${m.email}`} className="text-sm font-mono text-accent hover:underline">{m.email}</a>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{new Date(m.created_at).toLocaleDateString('pt-BR')}</span>
                           <button className="text-red-500 text-[10px] font-bold uppercase tracking-widest hover:underline" onClick={() => removeMessage(m.id)}>Deletar</button>
                        </div>
                    </div>
                    <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 mt-4 leading-relaxed">
                      <p className="text-zinc-700 whitespace-pre-wrap">{m.message}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
};
