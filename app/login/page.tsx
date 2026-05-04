'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    setCarregando(false)

    if (error) {
      setErro('Email ou senha inválidos.')
      return
    }

    router.push('/app')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 animate-fade-in">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-900/10 transition-all md:grid-cols-2">
        <div className="hidden bg-[#004B87] p-12 text-white md:flex md:flex-col md:justify-between relative overflow-hidden">
          {/* Elemento de brilho sutil no fundo */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFCC00]">
              Sentinelas
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white">
              Plano de Leitura Bíblica
            </h1>

            <p className="mt-5 text-white/80 leading-relaxed">
              Acompanhe sua jornada na Palavra, registre seu progresso e avance
              um dia por vez.
            </p>
          </div>

          <p className="text-sm italic text-white/70 relative z-10">
            “Ignorar as Escrituras é ignorar Cristo.” — São Jerônimo
          </p>
        </div>

        <form onSubmit={entrar} className="p-8 md:p-12 flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#004B87]/50">
            Bem-vindo
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#004B87]">
            Entrar na conta
          </h2>

          <p className="mt-2 text-gray-500">
            Acesse para continuar seu plano de leitura.
          </p>

          <div className="mt-8 space-y-5">
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Seu email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Sua senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 animate-fade-in border border-red-100">
              {erro}
            </p>
          )}

          <button
            disabled={carregando}
            className="mt-8 w-full rounded-xl bg-[#004B87] px-5 py-4 font-bold text-white transition-all hover:bg-[#003366] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="font-bold text-[#004B87] hover:text-[#FFCC00] transition-colors">
              Criar conta
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}