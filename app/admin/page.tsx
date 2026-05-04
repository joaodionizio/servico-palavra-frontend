'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type UsuarioAdmin = {
  id: string
  nome: string
  email: string
  concluidos: number
  percentual: number
  posicao: number
}

export default function AdminPage() {
  const router = useRouter()

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    verificarAdmin()
  }, [])

  async function verificarAdmin() {
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

    carregarUsuarios()
  }

  async function carregarUsuarios() {
    const { data } = await supabase
      .from('usuarios')
      .select(`
        id,
        nome,
        email,
        progresso_leitura (
          id,
          concluido
        )
      `)

    const totalDias = 600

    const usuariosFormatados =
      data?.map((usuario) => {
        const concluidos =
          usuario.progresso_leitura?.filter((p) => p.concluido).length || 0

        return {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          concluidos,
          percentual: Math.round((concluidos / totalDias) * 100)
        }
      }) || []

    const ranking = usuariosFormatados
      .sort((a, b) => b.concluidos - a.concluidos)
      .map((usuario, index) => ({
        ...usuario,
        posicao: index + 1
      }))

    setUsuarios(ranking)
    setCarregando(false)
  }

  if (carregando) {
    return (
      <div className="flex h-64 animate-fade-in items-center justify-center">
        <p className="animate-pulse text-lg font-bold text-[#004B87]">
          Carregando dados...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <Link
          href="/app"
          className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-[#004B87] hover:text-white"
        >
          ← Voltar para o site
        </Link>

        <h1 className="mt-6 text-3xl font-black text-[#004B87]">
          Ranking de Leitura
        </h1>

        <p className="mt-2 text-gray-500">
          Visão geral do progresso de todos os usuários da plataforma.
        </p>
      </div>

      <div className="space-y-4">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className={`group flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:items-center ${
              usuario.posicao === 1
                ? 'border-[#FFCC00]/50 bg-yellow-50/50 shadow-sm'
                : usuario.posicao === 2
                  ? 'border-gray-200 bg-gray-50'
                  : usuario.posicao === 3
                    ? 'border-orange-200 bg-orange-50/30'
                    : 'border-gray-100 bg-white'
            }`}
          >
            <div className="flex items-center gap-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-black ${
                  usuario.posicao === 1
                    ? 'bg-[#FFCC00] text-white shadow-md'
                    : usuario.posicao === 2
                      ? 'bg-gray-200 text-gray-600'
                      : usuario.posicao === 3
                        ? 'bg-orange-200 text-orange-700'
                        : 'bg-blue-50 text-[#004B87]'
                }`}
              >
                #{usuario.posicao}
              </div>

              <div>
                <p className="text-lg font-bold text-gray-800 transition-colors group-hover:text-[#004B87]">
                  {usuario.nome}
                </p>

                <p className="text-sm text-gray-500">{usuario.email}</p>
              </div>
            </div>

            <div className="mt-4 flex w-full flex-row items-center justify-between border-t pt-4 sm:mt-0 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">
              <div>
                <p className="text-2xl font-black text-[#004B87]">
                  {usuario.percentual}%
                </p>

                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  {usuario.concluidos} dias
                </p>
              </div>

              <Link
                href={`/admin/usuarios/${usuario.id}`}
                className="mt-2 inline-block rounded-xl bg-[#004B87] px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#003366]"
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}