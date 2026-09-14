import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { X, CaretLeft, CaretRight, MapPin, CalendarBlank } from '@phosphor-icons/react';

export const Gallery = () => {
  const [items, setItems] = useState<any[]>([]);
  const [albumsMeta, setAlbumsMeta] = useState<Record<string, any>>({});
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Album Meta
    getDocs(collection(db, 'albums_meta')).then((snapshot) => {
        if (!snapshot.empty) {
            const metaMap: Record<string, any> = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                metaMap[data.name] = data;
            });
            setAlbumsMeta(metaMap);
        }
    });

    return () => unsubscribe();
  }, []);

  const albums = items.reduce((acc: any, item: any) => {
    const album = item.album_name || 'Diversos';
    if (!acc[album]) {
      acc[album] = [];
    }
    acc[album].push(item);
    return acc;
  }, {});

  const albumNames = Object.keys(albums);

  // Lightbox Navigation
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAlbum && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % albums[selectedAlbum].length);
    }
  };
  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAlbum && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + albums[selectedAlbum].length) % albums[selectedAlbum].length);
    }
  };

  const currentAlbumItems = selectedAlbum ? albums[selectedAlbum] : [];
  const currentMeta = selectedAlbum ? albumsMeta[selectedAlbum] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 flex-1 w-full">
      <div className="mb-24 md:w-1/2">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-950">Registro<br/>Visual.</h1>
        <p className="text-zinc-500 text-lg">Retratos brutos de nossa atuação nas frentes de batalha.</p>
      </div>

      {!selectedAlbum ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albumNames.map((albumName) => {
              const coverItem = albums[albumName][0];
              const itemCount = albums[albumName].length;
              return (
                <div 
                  key={albumName} 
                  onClick={() => setSelectedAlbum(albumName)}
                  className="group cursor-pointer flex flex-col gap-4 animate-in fade-in"
                >
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative border border-zinc-200 bg-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                    {coverItem.media_type === 'video' ? (
                      <video src={coverItem.image_url} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={coverItem.image_url} className="w-full h-full object-cover" alt={albumName} />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                        <span className="text-white font-mono uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm">Abrir Álbum</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <h2 className="text-2xl font-bold text-zinc-950">{albumName}</h2>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mt-1">{itemCount} {itemCount === 1 ? 'mídia' : 'mídias'}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center w-full py-20 text-zinc-400 font-mono text-sm uppercase">Nenhum álbum postado ainda.</div>
          )}
        </>
      ) : (
        <div className="animate-in fade-in duration-500">
          <button 
            onClick={() => setSelectedAlbum(null)}
            className="flex items-center gap-3 text-zinc-500 hover:text-zinc-950 mb-12 font-bold transition-colors uppercase tracking-widest text-sm font-mono border border-zinc-200 hover:border-zinc-500 px-6 py-2 rounded-full max-w-max"
          >
            ← Voltar para Álbuns
          </button>
          
          <div className="mb-12 px-2 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-950 mb-4">{selectedAlbum}</h2>
            
            {currentMeta && (currentMeta.date || currentMeta.location) && (
              <div className="flex flex-wrap gap-4 text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                {currentMeta.date && <span className="flex items-center gap-2"><CalendarBlank size={16} /> {currentMeta.date}</span>}
                {currentMeta.location && <span className="flex items-center gap-2"><MapPin size={16} /> {currentMeta.location}</span>}
              </div>
            )}
            
            {currentMeta?.description && (
              <p className="text-zinc-600 text-lg leading-relaxed">{currentMeta.description}</p>
            )}
          </div>
          
          <div className="columns-1 md:columns-3 gap-6 space-y-6">
            {currentAlbumItems.map((item: any, idx: number) => (
              <div 
                key={item.id} 
                className="break-inside-avoid relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-50 shadow-sm cursor-pointer group"
                onClick={() => openLightbox(idx)}
              >
                {item.media_type === 'video' ? (
                  <video 
                    src={item.image_url} 
                    className="w-full h-auto bg-black"
                    controls 
                    playsInline 
                  />
                ) : (
                  <>
                    <img 
                      src={item.image_url} 
                      alt="Galeria" 
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Lightbox Overlay */}
          {lightboxIndex !== null && currentAlbumItems[lightboxIndex] && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300" onClick={closeLightbox}>
              
              {/* Close Button */}
              <button 
                className="absolute top-6 right-6 text-white p-3 bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-md transition-colors z-[110]"
                onClick={closeLightbox}
              >
                <X size={24} weight="bold" />
              </button>

              {/* Prev Button */}
              <button 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white p-4 bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-md transition-colors z-[110]"
                onClick={prevLightbox}
              >
                <CaretLeft size={32} weight="bold" />
              </button>

              {/* Next Button */}
              <button 
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white p-4 bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-md transition-colors z-[110]"
                onClick={nextLightbox}
              >
                <CaretRight size={32} weight="bold" />
              </button>

              {/* Media Content */}
              <div className="relative max-w-6xl max-h-[90vh] w-full px-4 md:px-24 flex justify-center items-center pointer-events-none">
                {currentAlbumItems[lightboxIndex].media_type === 'video' ? (
                  <video 
                    src={currentAlbumItems[lightboxIndex].image_url} 
                    className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl pointer-events-auto bg-black"
                    controls 
                    autoPlay
                    playsInline 
                  />
                ) : (
                  <img 
                    src={currentAlbumItems[lightboxIndex].image_url} 
                    alt="Lightbox" 
                    className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl pointer-events-auto"
                    onClick={(e) => e.stopPropagation()} 
                  />
                )}
              </div>
              
              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-mono text-sm tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                {lightboxIndex + 1} / {currentAlbumItems.length}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
