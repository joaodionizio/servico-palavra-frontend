'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'

type Usuario = {
  id: string
  nome: string
  email: string
}

type ProgressoMes = {
  mes: number
  concluidos: number
  percentual: number
}

type ProgressoLeitura = {
  id: string
  concluido: boolean
  plano_leitura_dias:
    | { mes_numero: number }
    | { mes_numero: number }[]
    | null
}

export default function DetalheUsuarioPage() {
  const router = useRouter()
  const params = useParams()
  const usuarioId = params.id as string

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [progressoMeses, setProgressoMeses] = useState<ProgressoMes[]>([])
  const [totalConcluidos, setTotalConcluidos] = useState(0)
  const [carregando, setCarregando] = useState(true)

  const pegarMesDoPlano = useCallback((item: ProgressoLeitura) => {
    const plano = item.plano_leitura_dias

    if (!plano) return null

    if (Array.isArray(plano)) {
      return plano[0]?.mes_numero ?? null
    }

    return plano.mes_numero
  }, [])

  const carregarDetalhes = useCallback(async () => {
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .eq('id', usuarioId)
      .single()

    if (usuarioError) {
      console.log('Erro ao buscar usuário:', usuarioError)
      setCarregando(false)
      return
    }

    const { data: progressoData, error: progressoError } = await supabase
      .from('progresso_leitura')
      .select(`
        id,
        concluido,
        plano_leitura_dias (
          mes_numero
        )
      `)
      .eq('usuario_id', usuarioId)
      .eq('concluido', true)

    if (progressoError) {
      console.log('Erro ao buscar progresso:', progressoError)
      setCarregando(false)
      return
    }

    const progresso = (progressoData || []) as ProgressoLeitura[]
    const total = progresso.length

    const meses = Array.from({ length: 20 }, (_, index) => {
      const mes = index + 1

      const concluidos = progresso.filter((item) => {
        return pegarMesDoPlano(item) === mes
      }).length

      return {
        mes,
        concluidos,
        percentual: Math.round((concluidos / 30) * 100)
      }
    })

    setUsuario(usuarioData)
    setTotalConcluidos(total)
    setProgressoMeses(meses)
    setCarregando(false)
  }, [pegarMesDoPlano, usuarioId])

  const verificarAdmin = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      router.push('/login')
      return
    }

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (perfil?.role !== 'admin') {
      router.push('/app')
      return
    }

    await carregarDetalhes()
  }, [carregarDetalhes, router])

  useEffect(() => {
    void Promise.resolve().then(verificarAdmin)
  }, [verificarAdmin])

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
        <p className="text-[#004B87] font-bold text-lg animate-pulse">
          Carregando detalhes do usuário...
        </p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
        <p className="text-red-500 font-bold p-10 bg-white rounded-2xl shadow">
          Usuário não encontrado.
        </p>
      </div>
    )
  }

  const percentualGeral = Math.round((totalConcluidos / 600) * 100)

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 animate-fade-in">
      <div className="mx-auto max-w-5xl space-y-8">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-2.5 font-bold text-gray-600 hover:text-[#004B87] hover:border-[#004B87] transition-all hover:shadow-sm"
        >
          <span>←</span> Voltar ao Ranking
        </button>

        <section className="rounded-2xl bg-white p-10 shadow-sm border border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">
              Detalhes do usuário
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#004B87]">
              {usuario.nome}
            </h1>

            <p className="mt-1 text-gray-500">{usuario.email}</p>
          </div>

          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-md">
            👤
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              📈 Progresso geral
            </p>

            <p className="mt-4 text-5xl font-black text-[#004B87]">
              {percentualGeral}%
            </p>

            <p className="mt-2 text-sm font-medium text-gray-400">
              {totalConcluidos} de 600 dias concluídos
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              ⭐ Meses completos
            </p>

            <p className="mt-4 text-5xl font-black text-[#004B87]">
              {progressoMeses.filter((mes) => mes.concluidos === 30).length}
            </p>

            <p className="mt-2 text-sm font-medium text-gray-400">
              de 20 meses no total
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-10 shadow-sm border border-gray-100">
          <h2 className="mb-8 text-2xl font-black text-[#004B87]">
            Progresso detalhado por mês
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {progressoMeses.map((mes) => (
              <div
                key={mes.mes}
                className="group rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-[#004B87]/20"
              >
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="font-bold text-[#004B87] text-lg">
                      Mês {mes.mes}
                    </p>

                    <p className="text-sm text-gray-400 font-medium mt-1">
                      {mes.concluidos} / 30 dias
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      mes.percentual === 100
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-50 text-[#004B87]'
                    }`}
                  >
                    {mes.percentual}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#004B87] rounded-full transition-all duration-700 ease-out group-hover:bg-[#FFCC00]"
                    style={{ width: `${mes.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
