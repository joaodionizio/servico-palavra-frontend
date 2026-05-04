'use client'

export default function IntroducaoPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-fade-in">
      {/* HEADER */}
      <section className="rounded-3xl border border-gray-100 bg-white p-12 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white"></div>
        <div className="relative z-10">
          <p className="text-center text-sm font-bold uppercase tracking-[0.35em] text-[#FFCC00]">
            Introdução espiritual
          </p>

          <h1 className="mt-5 text-center text-4xl font-black text-[#004B87]">
            Caminho de Leitura e Oração
          </h1>

          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-[#FFCC00]" />

          <p className="mx-auto mt-8 max-w-2xl text-center text-gray-600 text-lg leading-relaxed">
            Este plano segue a tradição da Igreja: contemplar primeiro Cristo,
            para depois compreender toda a Escritura à luz do Evangelho.
          </p>
        </div>
      </section>

      {/* INTRODUÇÃO */}
      <section className="rounded-3xl bg-white p-10 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-[#004B87] flex items-center gap-3">
          <span className="text-[#FFCC00] text-3xl">✦</span> Introdução Pastoral
        </h2>

        <p className="mt-6 text-gray-600 leading-relaxed text-lg">
          Este plano de leitura bíblica foi estruturado para conduzir o fiel
          a um encontro verdadeiro com Deus através da Palavra. Iniciamos pelo
          Novo Testamento, especialmente pelos escritos de São João, para que,
          contemplando o rosto de Cristo, possamos compreender todo o Antigo
          Testamento à luz da sua revelação.
        </p>

        <p className="mt-4 text-gray-600 leading-relaxed text-lg">
          A leitura deve ser feita com espírito de oração, não apenas como
          estudo, mas como diálogo com Deus. A Escritura é viva, e nela o Senhor
          fala diretamente ao coração de cada pessoa.
        </p>

        <div className="mt-8 rounded-2xl border-l-4 border-[#FFCC00] bg-blue-50/50 p-6">
          <p className="font-bold text-[#004B87] uppercase tracking-wider text-sm mb-2">
            Conselho espiritual
          </p>
          <p className="text-gray-700">
            Reze um Salmo por dia, conforme indicado no cronograma.
          </p>
        </div>
      </section>

      {/* CITAÇÃO */}
      <section className="rounded-3xl bg-[#004B87] p-12 text-center shadow-lg relative">
        <div className="absolute top-4 left-6 text-7xl text-white opacity-10 font-serif">"</div>
        <p className="relative z-10 text-2xl font-medium italic text-white leading-relaxed">
          “Ignorar as Escrituras é ignorar Cristo.”
        </p>

        <p className="mt-6 text-sm font-bold tracking-widest uppercase text-[#FFCC00]">
          — São Jerônimo
        </p>
      </section>

      {/* LECTIO DIVINA */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-[#004B87]">
            Lectio Divina
          </h2>

          <p className="mt-2 text-gray-500 font-medium">
            O método tradicional de oração com a Palavra
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              titulo: 'Leitura (Lectio)',
              texto: 'O que o texto diz em si mesmo? Leia com atenção.'
            },
            {
              titulo: 'Meditação (Meditatio)',
              texto: 'O que Deus fala comigo através deste texto?'
            },
            {
              titulo: 'Oração (Oratio)',
              texto: 'O que eu respondo a Deus?'
            },
            {
              titulo: 'Contemplação (Contemplatio)',
              texto: 'Permaneça em silêncio na presença de Deus.'
            },
            {
              titulo: 'Ação (Actio)',
              texto: 'Qual mudança concreta viverei hoje?'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#FFCC00]/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#004B87] font-black group-hover:bg-[#004B87] group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-[#004B87]">
                  {item.titulo}
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}