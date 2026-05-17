export const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
        <div>&copy; {new Date().getFullYear()} Primitiva NGO. Todos os direitos reservados.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-accent transition-colors">Privacidade</a>
          <a href="#" className="hover:text-accent transition-colors">Termos</a>
        </div>
      </div>
    </footer>
  );
};
