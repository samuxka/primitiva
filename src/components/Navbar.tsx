import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { List, X } from '@phosphor-icons/react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed w-full top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white drop-shadow-md z-[60]">
          PRIMITIVA
        </Link>
        
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><Link to="/sobre" className="hover:text-white text-zinc-300 transition-colors font-medium drop-shadow-sm">Sobre</Link></li>
          <li><Link to="/transparencia" className="hover:text-white text-zinc-300 transition-colors font-medium drop-shadow-sm">Transparência</Link></li>
          <li><Link to="/missoes" className="hover:text-white text-zinc-300 transition-colors font-medium drop-shadow-sm">Missões</Link></li>
          <li><Link to="/galeria" className="hover:text-white text-zinc-300 transition-colors font-medium drop-shadow-sm">Galeria</Link></li>
          <li><Link to="/estudos" className="hover:text-white text-zinc-300 transition-colors font-medium drop-shadow-sm">Estudos</Link></li>
        </ul>
        
        <div className="hidden md:block">
          <Link 
            to="/doar" 
            className="bg-accent text-zinc-950 font-bold px-6 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
          >
            Doar Agora
          </Link>
        </div>

        {!isMobileMenuOpen && (
          <button 
            className="md:hidden text-white z-[60] p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <List size={24} weight="bold" />
          </button>
        )}

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 w-full h-[100dvh] bg-black/98 backdrop-blur-xl z-[100] md:hidden transition-all duration-500 flex flex-col justify-center items-center gap-8 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <button 
             className="absolute top-6 right-6 text-white p-2 hover:text-accent transition-colors"
             onClick={() => setIsMobileMenuOpen(false)}
           >
             <X size={32} weight="bold" />
           </button>
           
           <ul className="flex flex-col items-center gap-8 text-2xl">
             <li><Link to="/sobre" className="hover:text-accent text-white transition-colors font-medium tracking-wide">Sobre</Link></li>
             <li><Link to="/transparencia" className="hover:text-accent text-white transition-colors font-medium tracking-wide">Transparência</Link></li>
             <li><Link to="/missoes" className="hover:text-accent text-white transition-colors font-medium tracking-wide">Missões</Link></li>
             <li><Link to="/galeria" className="hover:text-accent text-white transition-colors font-medium tracking-wide">Galeria</Link></li>
             <li><Link to="/estudos" className="hover:text-accent text-white transition-colors font-medium tracking-wide">Estudos</Link></li>
           </ul>
           
           <Link 
            to="/doar" 
            className="bg-accent text-zinc-950 font-bold px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform text-xl mt-8 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Doar Agora
          </Link>
        </div>
      </div>
    </nav>
  );
};
