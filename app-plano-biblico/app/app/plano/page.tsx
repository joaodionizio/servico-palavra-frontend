'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type DiaPlano = {
  id: number
  mes_numero: number
  dia_numero: number
  leitura_texto: string
  salmo_numero: number
}

type Progresso = {
  concluido_em: string | null
}

export default function PlanoPage() {
  const router = useRouter()

  const [dias, setDias] = useState<DiaPlano[]>([])
  const [concluidos, setConcluidos] = useState<number[]>([])
  const [usuarioId, setUsuarioId] = useState<string | null>(null)
  const [mesAtual, setMesAtual] = useState(1)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push('/login')
      return
    }

    setUsuarioId(userData.user.id)

    const { data: diasPlano, error: erroDias } = await supabase
      .from('plano_leitura_dias')
      .select('*')
      .order('mes_numero', { ascending: true })
      .order('dia_numero', { ascending: true })

    if (erroDias) {
      console.log('Erro ao buscar plano:', erroDias)
      return
    }

    const { data: progresso, error: erroProgresso } = await supabase
      .from('progresso_leitura')
      .select('plano_dia_id')
      .eq('usuario_id', userData.user.id)
      .eq('concluido', true)

    if (erroProgresso) {
      console.log('Erro ao buscar progresso:', erroProgresso)
      return
    }

    setDias(diasPlano || [])
    setConcluidos((progresso || []).map((p) => p.plano_dia_id))
  }

  async function alternarConclusao(diaId: number, marcado: boolean) {
    if (!usuarioId) return

    const { error } = await supabase
      .from('progresso_leitura')
      .upsert(
        {
          usuario_id: usuarioId,
          plano_dia_id: diaId,
          concluido: marcado,
          concluido_em: marcado ? new Date().toISOString() : null
        },
        {
          onConflict: 'usuario_id,plano_dia_id'
        }
      )

    if (error) {
      console.log('Erro ao salvar progresso:', error)
      return
    }

    let novosConcluidos: number[]

    if (marcado) {
      novosConcluidos = concluidos.includes(diaId)
        ? concluidos
        : [...concluidos, diaId]
    } else {
      novosConcluidos = concluidos.filter((id) => id !== diaId)
    }

    setConcluidos(novosConcluidos)

    await atualizarSequenciaUsuario(usuarioId)
  }

  async function atualizarSequenciaUsuario(idUsuario: string) {
    const { data, error } = await supabase
      .from('progresso_leitura')
      .select('concluido_em')
      .eq('usuario_id', idUsuario)
      .eq('concluido', true)
      .not('concluido_em', 'is', null)

    if (error) {
      console.log('Erro ao buscar datas da sequência:', error)
      return
    }

    const progressos = (data || []) as Progresso[]

    const datas = progressos
      .filter((item) => item.concluido_em)
      .map((item) => item.concluido_em as string)

    const { sequencia, ultimoDia } = calcularSequencia(datas)

    const { error: erroRpc } = await supabase.rpc(
      'atualizar_sequencia_usuario',
      {
        p_usuario_id: idUsuario,
        p_sequencia: sequencia,
        p_ultimo_dia: ultimoDia
      }
    )

    if (erroRpc) {
      console.log('Erro ao atualizar sequência:', erroRpc)
    }
  }

  function calcularSequencia(datas: string[]) {
    if (datas.length === 0) {
      return {
        sequencia: 0,
        ultimoDia: null
      }
    }

    const diasUnicos = Array.from(
      new Set(
        datas.map((data) => {
          const d = new Date(data)
          return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        })
      )
    ).sort((a, b) => b - a)

    const hoje = new Date()
    const hojeSemHora = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    ).getTime()

    let sequencia = 0

    for (let i = 0; i < diasUnicos.length; i++) {
      const dataEsperada = hojeSemHora - i * 86400000

      if (diasUnicos[i] === dataEsperada) {
        sequencia++
      } else {
        break
      }
    }

    const ultimoDia = new Date(diasUnicos[0]).toISOString().split('T')[0]

    return {
      sequencia,
      ultimoDia
    }
  }

  const diasPorMes = dias.reduce<Record<number, DiaPlano[]>>((acc, dia) => {
    if (!acc[dia.mes_numero]) acc[dia.mes_numero] = []
    acc[dia.mes_numero].push(dia)
    return acc
  }, {})

  const diasDoMesAtual = diasPorMes[mesAtual] || []

  const concluidosNoMes = diasDoMesAtual.filter((dia) =>
    concluidos.includes(dia.id)
  ).length

  const percentualMes =
    diasDoMesAtual.length > 0
      ? Math.round((concluidosNoMes / diasDoMesAtual.length) * 100)
      : 0

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* HEADER DE IMPACTO */}
      <div className="bg-[#004B87] rounded-3xl shadow-lg p-10 relative overflow-hidden transition-all hover:shadow-xl">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Plano Diário
            </h1>

            <p className="text-blue-100 text-lg max-w-md">
              Marque cada leitura concluída e acompanhe sua jornada crescer dia após dia.
            </p>
          </div>

          <div className="hidden md:flex h-20 w-20 rounded-full bg-white/10 border border-white/20 items-center justify-center text-4xl shadow-inner">
            📖
          </div>
        </div>
      </div>

      {/* CONTROLE DO MÊS E PROGRESSO */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between w-full mb-8">
          <button
            onClick={() => setMesAtual((mes) => Math.max(1, mes - 1))}
            disabled={mesAtual === 1}
            className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#004B87] font-bold text-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-x-1"
          >
            ←
          </button>

          <div className="text-center">
            <p className="text-xs text-[#FFCC00] uppercase tracking-[0.2em] font-bold mb-1">
              Progresso do
            </p>

            <p className="text-3xl font-black text-[#004B87]">
              Mês {mesAtual}
            </p>
          </div>

          <button
            onClick={() => setMesAtual((mes) => Math.min(20, mes + 1))}
            disabled={mesAtual === 20}
            className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#004B87] text-white hover:bg-[#003366] font-bold text-xl transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:translate-x-1"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-[#004B87] to-[#0066B3] h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentualMes}%` }}
            />
          </div>

          <div className="flex-shrink-0 text-right min-w-[80px]">
            <p className="text-lg font-black text-[#004B87]">
              {percentualMes}%
            </p>
          </div>
        </div>

        <p className="text-sm font-medium text-gray-500 mt-2">
          {concluidosNoMes} de {diasDoMesAtual.length} dias lidos
        </p>
      </div>

      {/* GRID DE DIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {diasDoMesAtual.map((dia) => {
          const concluido = concluidos.includes(dia.id)

          return (
            <div
              key={dia.id}
              onClick={() => alternarConclusao(dia.id, !concluido)}
              className={`group rounded-2xl p-6 flex items-start gap-6 transition-all duration-300 cursor-pointer border-2 ${
                concluido
                  ? 'bg-gray-50/80 border-gray-100 opacity-75 hover:opacity-100'
                  : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-[#FFCC00]/50'
              }`}
            >
              {/* CHECKBOX ANIMADO */}
              <div
                className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  concluido
                    ? 'bg-[#004B87] border-[#004B87] text-white scale-110 shadow-md'
                    : 'border-gray-300 text-transparent group-hover:border-[#004B87]'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* CONTEÚDO DO DIA REESTRUTURADO */}
              <div className="flex-grow pt-0.5">
                <h3
                  className={`font-black text-xl mb-4 transition-colors duration-300 ${
                    concluido ? 'text-gray-400 line-through' : 'text-[#004B87]'
                  }`}
                >
                  Dia {dia.dia_numero}
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Bloco da Leitura Bíblica */}
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-lg leading-none mt-0.5 transition-opacity ${
                        concluido ? 'opacity-40' : 'opacity-100'
                      }`}
                    >
                      📖
                    </span>

                    <div>
                      <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Leitura Diária
                      </p>

                      <p
                        className={`font-medium transition-colors duration-300 ${
                          concluido ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {dia.leitura_texto}
                      </p>
                    </div>
                  </div>

                  {/* Linha separadora */}
                  <div
                    className={`h-px w-full transition-colors duration-300 ${
                      concluido ? 'bg-gray-100' : 'bg-gray-50'
                    }`}
                  />

                  {/* Bloco do Salmo */}
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-lg leading-none mt-0.5 transition-opacity ${
                        concluido ? 'opacity-40' : 'opacity-100'
                      }`}
                    >
                      🙏
                    </span>

                    <div>
                      <p className="text-[0.65rem] font-bold text-[#FFCC00] uppercase tracking-widest mb-1">
                        Oração
                      </p>

                      <p
                        className={`font-bold transition-colors duration-300 ${
                          concluido ? 'text-gray-400' : 'text-[#004B87]'
                        }`}
                      >
                        Salmo {dia.salmo_numero}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}