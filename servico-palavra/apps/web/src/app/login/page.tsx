import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 animate-fade-in">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-900/10 transition-all md:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#004B87] p-12 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute right-0 top-0 -mr-10 -mt-10 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFCC00]">Serviço</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white">Serviço da Palavra</h1>
            <p className="mt-5 leading-relaxed text-white/80">
              Acompanhe formações, favoritos, progresso e sua caminhada espiritual em um só lugar.
            </p>
          </div>

          <p className="relative z-10 text-sm italic text-white/70">“Ignorar as Escrituras é ignorar Cristo.” — São Jerônimo</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
