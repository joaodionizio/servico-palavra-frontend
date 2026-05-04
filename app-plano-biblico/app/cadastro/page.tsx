'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Cadastro() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          name: nome
        }
      }
    })

    setCarregando(false)

    if (error) {
      setErro('Não foi possível criar sua conta. Verifique os dados e tente novamente.')
      return
    }

    router.push('/login')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 animate-fade-in">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-900/10 transition-all md:grid-cols-2">
        <div className="hidden bg-[#004B87] p-12 text-white md:flex md:flex-col md:justify-between relative overflow-hidden">
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFCC00]">
              Sentinelas
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white">
              Comece sua jornada na Palavra
            </h1>

            <p className="mt-5 text-white/80 leading-relaxed">
              Crie sua conta para acompanhar seu progresso no plano de leitura
              bíblica e continuar de onde parou em qualquer dispositivo.
            </p>
          </div>

          <p className="text-sm italic text-white/70 relative z-10">
            “Tua palavra é lâmpada para os meus pés e luz para o meu caminho.”
          </p>
        </div>

        <form onSubmit={cadastrar} className="p-8 md:p-12 flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#004B87]/50">
            Nova conta
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#004B87]">
            Criar cadastro
          </h2>

          <p className="mt-2 text-gray-500">
            Informe seus dados para salvar seu progresso de leitura.
          </p>

          <div className="mt-8 space-y-4">
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Seu email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Crie uma senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-3.5 outline-none transition-all duration-300 focus:bg-white focus:border-[#004B87] focus:ring-4 focus:ring-[#004B87]/10"
              placeholder="Confirme sua senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
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
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            Já tem conta?{' '}
            <Link href="/login" className="font-bold text-[#004B87] hover:text-[#FFCC00] transition-colors">
              Entrar
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}