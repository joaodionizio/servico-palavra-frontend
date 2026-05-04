'use client'

import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

export default function Home() {
  useEffect(() => {
    async function testarConexao() {
      const { data, error } = await supabase
        .from('plano_leitura_dias')
        .select('*')
        .limit(5)

      console.log('DADOS:', data)
      console.log('ERRO:', error)
    }

    testarConexao()
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Conectando com Supabase...</h1>
      <p>Abra o console do navegador para verificar.</p>
    </main>
  )
}