import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 md:py-48 flex-1">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end"
      >
        <div className="flex flex-col justify-end">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1] mb-8 text-zinc-950">
            Nós não escolhemos <br/> o caminho <span className="italic font-light text-zinc-500">fácil.</span>
          </h1>
          <p className="text-xl text-zinc-950 leading-relaxed max-w-[45ch]">
            A Primitiva nasceu da urgência. Não somos apenas doadores; somos executores. 
            Operamos onde a esperança falha, conectando excelência técnica com compaixão brutal.
          </p>
        </div>

        <div className="relative pt-[20%]">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] glass-effect p-2 ml-auto w-full md:w-[80%]">
            <img 
              src="/images/about.jpg" 
              className="w-full h-full object-cover rounded-3xl transition-all duration-700"
              alt="Membros da Primitiva"
            />
          </div>
        </div>
      </motion.div>

      {/* Sobre, Missão e Visão */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-32 md:mt-48 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start"
      >
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 text-zinc-950">
            Quem <span className="italic font-light text-zinc-500">Somos.</span>
          </h2>
          <div className="prose prose-lg text-zinc-600 leading-relaxed">
            <p>
              Somos uma equipe missionária com coração ardente por missões. Fomos inundados com o texto de Atos 6, onde os discípulos se propuseram a escolher sete para atender a mesa do Senhor.
            </p>
            <p className="mt-4">
              Hoje representamos esses sete em todas as esferas da sociedade, servimos a mesa do Senhor, quando preciso ficamos calados ao lado de quem sente a dor ou ouvir seus lamentos e alimentar suas esperanças e seu espírito com a palavra de Deus bem como sua carne com o pão, trazer alegria aos que precisam de uma visita, sermos o socorro do necessitado, somos aqueles que <strong className="text-zinc-950 font-bold">SERVEM A MESA DO SENHOR.</strong>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-8 md:p-12 rounded-[2rem] bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 transition-colors duration-500 shadow-sm">
            <h3 className="text-3xl font-bold mb-6 text-zinc-950 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-zinc-950 inline-block"></span>
              Nossa <span className="italic font-light">Missão</span>
            </h3>
            <blockquote className="border-l-4 border-zinc-200 pl-6 my-6 font-serif italic text-lg text-zinc-500 leading-relaxed">
              "Ide por todo mundo e pregai o evangelho a toda criatura... A religião pura e imaculada para com Deus e Pai, é esta: Visitar os órfãos e as viúvas nas suas tribulações..."
              <footer className="text-sm font-sans not-italic font-medium text-zinc-400 mt-3">— Marcos 16:15 e Tiago 1:27</footer>
            </blockquote>
            <p className="text-zinc-600 leading-relaxed">
              Eis aí a base de nossa missão, pois cremos que este sim é o verdadeiro evangelho e esta é a missão que nos foi designada para fazermos. Mesmo de longe é possível sim executar o ide do Senhor. Temos colaboradores que tem nos ajudado financeiramente o que torna isso possível.
            </p>
          </div>

          <div className="p-8 md:p-12 rounded-[2rem] bg-zinc-950 text-zinc-50 hover:bg-zinc-900 transition-colors duration-500 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 relative z-10">
              <span className="w-8 h-[2px] bg-zinc-50 inline-block"></span>
              Nossa <span className="italic font-light text-zinc-400">Visão</span>
            </h3>
            <blockquote className="border-l-4 border-zinc-800 pl-6 my-6 font-serif italic text-lg text-zinc-300 leading-relaxed relative z-10">
              "E, perseverando unânimes todos os dias no templo, e partindo o pão em casa, comiam juntos com alegria e singeleza de coração, louvando a Deus, e caindo na graça de todo o povo. E todos os dias acrescentava o Senhor à igreja aqueles que se haviam de salvar"
              <footer className="text-sm font-sans not-italic font-medium text-zinc-500 mt-3">— Atos 2:46-47</footer>
            </blockquote>
            <p className="text-zinc-400 leading-relaxed relative z-10">
              Crendo que este é o verdadeiro evangelho, seguimos em oração e com o coração ardente pra que cada objetivo, cada meta seja alcançada para que possamos proporcionar cada vez mais sorrisos no rosto, alegria no coração e salvação nas almas oprimidas.
            </p>
          </div>
        </div>
      </motion.div>      <div className="mt-48">
         <h2 className="text-2xl font-mono text-accent mb-12 uppercase tracking-widest text-center">Nossos Valores</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-12 mt-12 px-0 md:px-12">
            <div>
              <p className="text-6xl text-zinc-800 font-bold mb-6 tracking-tighter">01</p>
              <h3 className="text-3xl font-bold mb-4">Urgência</h3>
              <p className="text-zinc-500 leading-relaxed">Em crises, horas custam vidas. Desenvolvemos logísticas que cortam a burocracia e entregam soluções imediatamente.</p>
            </div>
            <div className="md:mt-12">
              <p className="text-6xl text-zinc-800 font-bold mb-6 tracking-tighter">02</p>
              <h3 className="text-3xl font-bold mb-4">Excelência</h3>
              <p className="text-zinc-500 leading-relaxed">Solidariedade não justifica amadorismo. Aplicamos os mais altos padrões de design, engenharia civil e social em nossos projetos.</p>
            </div>
            <div className="md:mt-24">
              <p className="text-6xl text-zinc-800 font-bold mb-6 tracking-tighter">03</p>
              <h3 className="text-3xl font-bold mb-4">Perenidade</h3>
              <p className="text-zinc-500 leading-relaxed">Não damos o peixe. Nós reerguemos o ecossistema. Nosso foco a longo prazo é a autonomia absoluta das comunidades.</p>
            </div>
         </div>
      </div>
    </div>
  );
};
