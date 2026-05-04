'use client'

type MesResumo = {
  id: number
  titulo: string
  leituras: string
}

type FaseCronograma = {
  titulo: string
  meses: MesResumo[]
}

const fasesCronograma: FaseCronograma[] = [
  {
    titulo: 'Meses 1 ao 6: O Novo Testamento',
    meses: [
      {
        id: 1,
        titulo: 'MÊS 1',
        leituras:
          '1ª Carta de São João (1ª vez)\nEvangelho de São João (1ª vez)'
      },
      {
        id: 2,
        titulo: 'MÊS 2',
        leituras:
          '1ª Carta de São João (2ª vez)\nEvangelho de São Marcos • Gálatas'
      },
      {
        id: 3,
        titulo: 'MÊS 3',
        leituras:
          'Efésios • Filipenses\nColossenses • 1ª Tessalonicenses'
      },
      {
        id: 4,
        titulo: 'MÊS 4',
        leituras:
          '2ª Tessalonicenses • 1ª e 2ª Timóteo\nTito • Filemon'
      },
      {
        id: 5,
        titulo: 'MÊS 5',
        leituras:
          'Evangelho de São Lucas\nAtos dos Apóstolos (Caps. 1–14)'
      },
      {
        id: 6,
        titulo: 'MÊS 6',
        leituras:
          'Atos dos Apóstolos (Caps. 15–28)\nRomanos'
      }
    ]
  },
  {
    titulo: 'Meses 7 ao 12: Cartas e Pentateuco',
    meses: [
      {
        id: 7,
        titulo: 'MÊS 7',
        leituras:
          'Evangelho de São Mateus\n1ª Coríntios'
      },
      {
        id: 8,
        titulo: 'MÊS 8',
        leituras:
          '2ª Coríntios\nHebreus • Tiago'
      },
      {
        id: 9,
        titulo: 'MÊS 9',
        leituras:
          '1ª e 2ª Pedro • 2ª e 3ª João\nJudas • Apocalipse'
      },
      {
        id: 10,
        titulo: 'MÊS 10',
        leituras:
          '1ª Carta de São João (3ª vez)\nEvangelho de São João (2ª vez)'
      },
      {
        id: 11,
        titulo: 'MÊS 11',
        leituras:
          'Gênesis\nÊxodo (Caps. 1–20)'
      },
      {
        id: 12,
        titulo: 'MÊS 12',
        leituras:
          'Êxodo (Caps. 21–40)\nNúmeros'
      }
    ]
  },
  {
    titulo: 'Meses 13 ao 18: Históricos e Profetas',
    meses: [
      {
        id: 13,
        titulo: 'MÊS 13',
        leituras:
          'Josué • Juízes\nRute'
      },
      {
        id: 14,
        titulo: 'MÊS 14',
        leituras:
          '1º Livro de Samuel\n2º Livro de Samuel'
      },
      {
        id: 15,
        titulo: 'MÊS 15',
        leituras:
          '1º Livro dos Reis\n2º Livro dos Reis'
      },
      {
        id: 16,
        titulo: 'MÊS 16',
        leituras:
          'Amós • Oseias\nIsaías (Caps. 1–39)'
      },
      {
        id: 17,
        titulo: 'MÊS 17',
        leituras:
          'Miqueias • Naum • Habacuc\nJeremias • Lamentações'
      },
      {
        id: 18,
        titulo: 'MÊS 18',
        leituras:
          'Ezequiel • Abdias\nIsaías (Caps. 44–55)'
      }
    ]
  },
  {
    titulo: 'Meses 19 e 20: Pós-Exílio e Sapienciais',
    meses: [
      {
        id: 19,
        titulo: 'MÊS 19',
        leituras:
          '1ª e 2ª Crônicas\nEsdras • Neemias'
      },
      {
        id: 20,
        titulo: 'MÊS 20',
        leituras:
          'Ageu • Zacarias • Malaquias • Joel • Jonas\nTobias • Judite • Ester • Jó • Eclesiastes\n1º e 2º Macabeus • Baruc • Daniel\nSabedoria • Levítico • Deuteronômio'
      }
    ]
  }
]

export default function CronogramaPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 pb-12 animate-fade-in">
      <section className="mt-8 space-y-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FFCC00]">
          Visão Geral do Percurso
        </p>

        <h1 className="text-4xl font-black text-[#004B87] md:text-5xl">
          Cronograma Completo
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-500">
          Consulte as principais leituras e fases do plano organizado em 20 meses.
          A leitura diária detalhada está disponível na aba Plano.
        </p>
      </section>

      <div className="space-y-16">
        {fasesCronograma.map((fase) => (
          <section key={fase.titulo} className="space-y-12">
            <div className="flex items-center justify-center gap-6">
              <div className="h-[2px] max-w-[150px] flex-1 bg-gradient-to-r from-transparent to-[#FFCC00] md:max-w-[250px]" />

              <h2 className="text-center text-2xl font-bold uppercase tracking-widest text-[#004B87] md:text-3xl">
                {fase.titulo}
              </h2>

              <div className="h-[2px] max-w-[150px] flex-1 bg-gradient-to-l from-transparent to-[#FFCC00] md:max-w-[250px]" />
            </div>

            <div
              className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${
                fase.meses.length > 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
              }`}
            >
              {fase.meses.map((mes) => (
                <article
                  key={mes.id}
                  className="group relative overflow-hidden rounded-xl border border-[#FFCC00]/40 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#004B87] hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10 mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-wider text-[#004B87] transition-colors group-hover:text-[#FFCC00]">
                      {mes.titulo}
                    </h3>

                    <span className="text-xl font-black text-[#FFCC00] opacity-70 transition-all duration-500 group-hover:rotate-90 group-hover:opacity-100">
                      ✦
                    </span>
                  </div>

                  <div className="relative z-10 mb-6 h-px w-full bg-gray-200 transition-colors duration-500 group-hover:bg-[#FFCC00]" />

                  <p className="relative z-10 whitespace-pre-line text-[1.05rem] font-medium leading-relaxed text-gray-600">
                    {mes.leituras}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-[#FFCC00]/40 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FFCC00]">
          Laus Deo
        </p>

        <p className="mt-3 text-lg font-medium text-gray-600">
          Que a Palavra de Deus seja lâmpada para os vossos pés.
        </p>
      </section>
    </div>
  )
}