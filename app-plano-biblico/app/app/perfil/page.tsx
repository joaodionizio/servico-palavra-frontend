'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Usuario = {
  nome: string
  email: string
}

type DiaPlano = {
  id: number
  mes_numero: number
}

type Progresso = {
  plano_dia_id: number
  concluido_em: string | null
}

export default function PerfilPage() {
  const router = useRouter()

  const [usuarioId, setUsuarioId] = useState('')
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [dias, setDias] = useState<DiaPlano[]>([])
  const [progresso, setProgresso] = useState<Progresso[]>([])

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const carregarPerfil = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push('/login')
      return
    }

    setUsuarioId(userData.user.id)

    const { data: usuarioData } = await supabase
      .from('usuarios')
      .select('nome, email')
      .eq('id', userData.user.id)
      .single()

    const { data: diasPlano } = await supabase
      .from('plano_leitura_dias')
      .select('id, mes_numero')

    const { data: progressoData } = await supabase
      .from('progresso_leitura')
      .select('plano_dia_id, concluido_em')
      .eq('usuario_id', userData.user.id)
      .eq('concluido', true)

    if (usuarioData) {
      setUsuario(usuarioData)
      setNome(usuarioData.nome)
      setEmail(usuarioData.email)
    }

    setNovaSenha('')
    setConfirmarSenha('')

    setDias(diasPlano || [])
    setProgresso(progressoData || [])
    setCarregando(false)
  }, [router])

  useEffect(() => {
    void Promise.resolve().then(carregarPerfil)
  }, [carregarPerfil])

  async function atualizarPerfil(e: React.FormEvent) {
    e.preventDefault()

    setErro('')
    setMensagem('')
    setSalvando(true)

    if (!usuarioId || !usuario) {
      setErro('Usuário não encontrado.')
      setSalvando(false)
      return
    }

    if (novaSenha && novaSenha.length < 6) {
      setErro('A nova senha precisa ter pelo menos 6 caracteres.')
      setSalvando(false)
      return
    }

    if (novaSenha && novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      setSalvando(false)
      return
    }

    const emailFoiAlterado = email !== usuario.email
    const nomeFoiAlterado = nome !== usuario.nome
    const senhaFoiAlterada = novaSenha.length > 0

    if (!emailFoiAlterado && !nomeFoiAlterado && !senhaFoiAlterada) {
      setMensagem('Nenhuma alteração foi feita.')
      setSalvando(false)
      return
    }

    if (emailFoiAlterado) {
      const { error: erroEmailAuth } = await supabase.auth.updateUser({
        email
      })

      if (erroEmailAuth) {
        setErro('Não foi possível atualizar o email.')
        setSalvando(false)
        return
      }
    }

    if (senhaFoiAlterada) {
      const { error: erroSenha } = await supabase.auth.updateUser({
        password: novaSenha
      })

      if (erroSenha) {
        setErro('Não foi possível atualizar a senha.')
        setSalvando(false)
        return
      }
    }

    if (nomeFoiAlterado || emailFoiAlterado) {
      const { error: erroUsuario } = await supabase
        .from('usuarios')
        .update({
          nome,
          email
        })
        .eq('id', usuarioId)

      if (erroUsuario) {
        setErro('Não foi possível atualizar os dados do perfil.')
        setSalvando(false)
        return
      }
    }

    setUsuario({
      nome,
      email
    })

    setNovaSenha('')
    setConfirmarSenha('')

    setMensagem(
      emailFoiAlterado
        ? 'Perfil atualizado. Verifique seu novo email, caso o Supabase solicite confirmação.'
        : 'Perfil atualizado com sucesso.'
    )

    setSalvando(false)
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

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="animate-pulse text-lg font-bold text-[#004B87]">
          Carregando perfil...
        </p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow">
        <p className="font-bold text-red-600">Usuário não encontrado.</p>
      </div>
    )
  }

  const totalDias = 600
  const diasConcluidos = progresso.length
  const percentual = Math.round((diasConcluidos / totalDias) * 100)

  const streak = calcularStreak(
    progresso
      .filter((item) => item.concluido_em)
      .map((item) => item.concluido_em as string)
  )

  const meses = Array.from({ length: 20 }, (_, index) => {
    const mes = index + 1

    const diasDoMes = dias.filter((dia) => dia.mes_numero === mes)

    const concluidosDoMes = progresso.filter((item) =>
      diasDoMes.some((dia) => dia.id === item.plano_dia_id)
    ).length

    return {
      mes,
      concluidos: concluidosDoMes,
      percentual: Math.round((concluidosDoMes / 30) * 100)
    }
  })

  const mesesCompletos = meses.filter((mes) => mes.concluidos === 30).length

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">
          Meu perfil
        </p>

        <h1 className="mt-2 text-3xl font-black text-[#004B87]">
          {usuario.nome}
        </h1>

        <p className="mt-1 text-gray-500">{usuario.email}</p>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-black text-[#004B87]">
          Dados da conta
        </h2>

        <form onSubmit={atualizarPerfil} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-600">
              Nome
            </label>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-600">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/20"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-600">
                Nova senha
              </label>

              <input
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Deixe em branco para não alterar"
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-600">
                Confirmar nova senha
              </label>

              <input
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Confirme a nova senha"
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#004B87] focus:ring-2 focus:ring-[#004B87]/20"
              />
            </div>
          </div>

          {erro && (
            <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {erro}
            </p>
          )}

          {mensagem && (
            <p className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
              {mensagem}
            </p>
          )}

          <button
            disabled={salvando}
            className="rounded-xl bg-[#004B87] px-6 py-3 font-bold text-white transition hover:bg-[#003366] disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-gray-500">
            Progresso
          </p>

          <p className="mt-3 text-4xl font-black text-[#004B87]">
            {percentual}%
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {diasConcluidos} de {totalDias} dias
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-gray-500">
            Concluídos
          </p>

          <p className="mt-3 text-4xl font-black text-[#004B87]">
            {diasConcluidos}
          </p>
        </div>

        <div className="rounded-2xl border border-[#FFCC00] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-gray-500">
            Sequência
          </p>

          <p className="mt-3 text-4xl font-black text-[#004B87]">
            🔥 {streak}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {streak === 1 ? 'dia seguido' : 'dias seguidos'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-gray-500">
            Meses completos
          </p>

          <p className="mt-3 text-4xl font-black text-[#004B87]">
            {mesesCompletos}
          </p>

          <p className="mt-2 text-sm text-gray-500">de 20 meses</p>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-black text-[#004B87]">
          Progresso por mês
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {meses.map((mes) => (
            <div key={mes.mes} className="rounded-2xl border p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#004B87]">
                    Mês {mes.mes}
                  </p>

                  <p className="text-sm text-gray-500">
                    {mes.concluidos} de 30 dias
                  </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-[#004B87]">
                  {mes.percentual}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#004B87]"
                  style={{ width: `${mes.percentual}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
