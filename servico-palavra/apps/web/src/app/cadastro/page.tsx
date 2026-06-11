import { RegisterForm } from "@/components/auth/RegisterForm";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 animate-fade-in">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-900/10 transition-all md:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#004B87] p-12 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#FFCC00]">Nova conta</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white">Comece sua jornada na Palavra</h1>
            <p className="mt-5 leading-relaxed text-white/80">
              Crie sua conta para acompanhar formações, trilhas, favoritos, progresso e plano bíblico.
            </p>
          </div>

          <p className="relative z-10 text-sm italic text-white/70">“Tua palavra é lâmpada para os meus pés e luz para o meu caminho.”</p>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
