'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type DiaPlano = {
  id: number
  mes_numero: number
  dia_numero: number
  leitura_texto: string
  salmo_numero: number
}

type Progresso = {
  plano_dia_id: number
  concluido_em: string | null
}

type Usuario = {
  nome: string
  sequencia_atual: number
  ultimo_dia_lido: string | null
}

export default function AppHome() {
  const router = useRouter()

  const [dias, setDias] = useState<DiaPlano[]>([])
  const [concluidos, setConcluidos] = useState<number[]>([])
  const [progresso, setProgresso] = useState<Progresso[]>([])
  const [streak, setStreak] = useState(0)
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push('/login')
      return
    }

    const { data: usuarioData } = await supabase
      .from('usuarios')
      .select('nome, sequencia_atual, ultimo_dia_lido')
      .eq('id', userData.user.id)
      .single()

    const { data: diasPlano } = await supabase
      .from('plano_leitura_dias')
      .select('*')
      .order('mes_numero', { ascending: true })
      .order('dia_numero', { ascending: true })

    const { data: progressoData } = await supabase
      .from('progresso_leitura')
      .select('plano_dia_id, concluido_em')
      .eq('usuario_id', userData.user.id)
      .eq('concluido', true)

    const progressoFormatado = (progressoData || []) as Progresso[]

    setUsuario(usuarioData || null)
    setDias(diasPlano || [])
    setProgresso(progressoFormatado)
    setConcluidos(progressoFormatado.map((item) => item.plano_dia_id))

    const streakCalculado = calcularStreak(
      progressoFormatado
        .filter((item) => item.concluido_em)
        .map((item) => item.concluido_em as string)
    )

    setStreak(usuarioData?.sequencia_atual ?? streakCalculado)
  }

  function calcularStreak(datas: string[]) {
    if (datas.length === 0) return 0

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

    let streakAtual = 0

    for (let i = 0; i < diasUnicos.length; i++) {
      const dataEsperada = hojeSemHora - i * 86400000

      if (diasUnicos[i] === dataEsperada) {
        streakAtual++
      } else {
        break
      }
    }

    return streakAtual
  }

  function calcularLeiturasUltimosSeteDias() {
    const hoje = new Date()
    const hojeSemHora = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    ).getTime()

    const diasUnicos = new Set(
      progresso
        .filter((item) => item.concluido_em)
        .map((item) => {
          const data = new Date(item.concluido_em as string)

          return new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate()
          ).getTime()
        })
        .filter((data) => {
          const diferenca = hojeSemHora - data
          return diferenca >= 0 && diferenca <= 6 * 86400000
        })
    )

    return diasUnicos.size
  }

  const totalDias = dias.length
  const totalConcluidos = concluidos.length
  const percentual =
    totalDias > 0 ? Math.round((totalConcluidos / totalDias) * 100) : 0

  const proximoDia = dias.find((dia) => !concluidos.includes(dia.id))

  const mesReferencia = proximoDia?.mes_numero || 1

  const diasDoMesAtual = dias.filter((dia) => dia.mes_numero === mesReferencia)

  const concluidosNoMes = diasDoMesAtual.filter((dia) =>
    concluidos.includes(dia.id)
  ).length

  const percentualMes =
    diasDoMesAtual.length > 0
      ? Math.round((concluidosNoMes / diasDoMesAtual.length) * 100)
      : 0

  const diasRestantesMes = diasDoMesAtual.length - concluidosNoMes
  const leiturasUltimosSeteDias = calcularLeiturasUltimosSeteDias()

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      <section className="rounded-2xl bg-white p-10 shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <p className="text-sm font-bold tracking-widest uppercase text-[#FFCC00]">
          Bem-vindo, {usuario?.nome || 'Leitor'}
        </p>

        <h2 className="mt-3 text-3xl font-bold text-[#004B87]">
          Sua jornada na Palavra
        </h2>

        <p className="mt-3 text-gray-500">
          Continue firme. Cada dia conta.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl mb-2">
            📊
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Progresso
          </p>

          <p className="text-4xl font-black text-[#004B87]">
            {percentual}%
          </p>

          <p className="text-sm font-medium text-gray-400">
            {totalConcluidos}/{totalDias} dias
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-2xl mb-2">
            ✅
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Concluídos
          </p>

          <p className="text-4xl font-black text-[#004B87]">
            {totalConcluidos}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md border-2 border-[#FFCC00] flex flex-col gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-7xl opacity-10">
            🔥
          </div>

          <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-2xl mb-2 relative z-10">
            🔥
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider relative z-10">
            Sequência
          </p>

          <p className="text-4xl font-black text-[#004B87] relative z-10">
            {streak}
          </p>

          <p className="text-sm font-medium text-gray-400 relative z-10">
            {streak === 1 ? 'dia' : 'dias'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-2">
            📖
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Total do plano
          </p>

          <p className="text-4xl font-black text-[#004B87]">
            {totalDias}
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl mb-2">
            📅
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Mês atual
          </p>

          <p className="text-4xl font-black text-[#004B87]">
            {percentualMes}%
          </p>

          <p className="text-sm font-medium text-gray-400">
            {concluidosNoMes}/{diasDoMesAtual.length} dias do mês {mesReferencia}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-2xl mb-2">
            ⏳
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Restam no mês
          </p>

          <p className="text-4xl font-black text-[#004B87]">
            {diasRestantesMes}
          </p>

          <p className="text-sm font-medium text-gray-400">
            dias para fechar o mês {mesReferencia}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl mb-2">
            🗓️
          </div>

          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Últimos 7 dias
          </p>

          <p className="text-4xl font-black text-[#004B87]">
            {leiturasUltimosSeteDias}
          </p>

          <p className="text-sm font-medium text-gray-400">
            dias com leitura registrada
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-[#004B87] p-10 shadow-lg text-white transition-all hover:shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>

        <div className="relative z-10">
          {proximoDia ? (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">
                Próxima leitura
              </p>

              <h3 className="mt-4 text-3xl font-black">
                Mês {proximoDia.mes_numero} • Dia {proximoDia.dia_numero}
              </h3>

              <p className="mt-3 text-white/80 max-w-2xl text-lg">
                {proximoDia.leitura_texto}
              </p>

              <a
                href="/app/plano"
                className="mt-8 inline-block rounded-xl bg-[#FFCC00] px-8 py-4 font-bold text-[#004B87] transition-all hover:bg-yellow-400 hover:shadow-lg transform hover:-translate-y-1"
              >
                Continuar leitura
              </a>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <span className="text-5xl mb-4">🙏</span>

              <p className="text-3xl font-black text-white">
                Plano concluído
              </p>

              <p className="text-white/80 mt-2">
                Parabéns por finalizar sua jornada na Palavra!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}