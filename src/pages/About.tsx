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
            Nossa <span className="italic font-light text-zinc-500">História.</span>
          </h1>
          <p className="text-xl text-zinc-950 leading-relaxed max-w-[45ch]">
            Há mais de duas décadas, nós, Ildelandio Oliveira e Ana Rita Oliveira, caminhamos juntos no propósito de servir através do trabalho missionário.
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
              Ao longo dessa jornada, tivemos a oportunidade de atuar em diferentes áreas, sempre com o compromisso de cuidar de pessoas, fortalecer famílias e contribuir para o desenvolvimento espiritual e social das comunidades onde estivemos presentes.
            </p>
            <p className="mt-4">
              Nossa atuação inclui ministérios voltados para crianças, jovens e adolescentes, homens, mulheres e casais, além do ensino da Palavra, música e projetos esportivos, como jiu-jitsu e futebol, utilizando cada iniciativa como uma ferramenta de aproximação, acolhimento e transformação. Também promovemos cursos de bordado e culinária em comunidades carentes, incentivando aprendizado, geração de oportunidades e desenvolvimento pessoal.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-8 md:p-12 rounded-[2rem] bg-zinc-50/50 border border-zinc-100 hover:border-zinc-200 transition-colors duration-500 shadow-sm">
            <h3 className="text-3xl font-bold mb-6 text-zinc-950 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-zinc-950 inline-block"></span>
              Apoio & <span className="italic font-light">Parcerias</span>
            </h3>
            <p className="text-zinc-600 leading-relaxed text-lg">
              Participamos ainda de ações de apoio a famílias em situação de vulnerabilidade, bem como trabalhos em centros de recuperação, contando ao longo dos anos com o suporte de pastores parceiros e da Convenção CBMB, que fizeram parte dessa caminhada de fé e serviço.
            </p>
          </div>

          <div className="p-8 md:p-12 rounded-[2rem] bg-zinc-950 text-zinc-50 hover:bg-zinc-900 transition-colors duration-500 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3 relative z-10">
              <span className="w-8 h-[2px] bg-zinc-50 inline-block"></span>
              A Missão em <span className="italic font-light text-zinc-400">Moçambique</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed relative z-10 text-lg mb-6">
              Atualmente, estamos à frente de um trabalho missionário em Vila de Caia, em Moçambique, África, dedicando nossa vida ao desenvolvimento de projetos que unem fé, cuidado, ensino e apoio à comunidade local.
            </p>
            <p className="text-zinc-300 font-medium leading-relaxed relative z-10 text-xl border-l-4 border-zinc-700 pl-6 italic">
              "Acreditamos que servir é estar presente, ouvir, ensinar e contribuir de forma prática e responsável, sempre guiados pelo amor ao próximo e pelo propósito de transformar vidas através da missão."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
