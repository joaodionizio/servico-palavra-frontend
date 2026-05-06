'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [admin, setAdmin] = useState(false)

  const verificarUsuario = useCallback(async () => {
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

    setAdmin(perfil?.role === 'admin')
    setCarregando(false)
  }, [router])

  useEffect(() => {
    void Promise.resolve().then(verificarUsuario)
  }, [verificarUsuario])

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
        <div className="animate-slide-up rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FFCC00]">
            Sentinelas
          </p>

          <p className="mt-2 animate-pulse text-lg font-bold text-[#004B87]">
            Carregando...
          </p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/app" className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FFCC00]">
              Sentinelas
            </span>

            <span className="text-xl font-black text-[#004B87] sm:text-2xl">
              Plano de Leitura Bíblica
            </span>
          </Link>

          <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-semibold lg:overflow-visible lg:pb-0">
            <Link
              href="/app"
              className="whitespace-nowrap rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
            >
              Início
            </Link>

            <Link
              href="/app/introducao"
              className="whitespace-nowrap rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
            >
              Introdução
            </Link>

            <Link
              href="/app/plano"
              className="whitespace-nowrap rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
            >
              Plano
            </Link>

            <Link
              href="/app/cronograma"
              className="whitespace-nowrap rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
            >
              Cronograma
            </Link>

            <Link
              href="/app/perfil"
              className="whitespace-nowrap rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
            >
              Perfil
            </Link>

            {admin && (
              <Link
                href="/admin"
                className="whitespace-nowrap rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]"
              >
                Admin
              </Link>
            )}

            <button
              onClick={sair}
              className="whitespace-nowrap rounded-full bg-[#004B87] px-5 py-2 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#003366] hover:shadow-md"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  )
}
