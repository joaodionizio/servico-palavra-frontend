import { RegisterForm } from "@/components/auth/RegisterForm";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export default function CadastroPage() {
  return (
    <main className="register-experience min-h-screen p-5 animate-fade-in md:p-8">
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1500px] overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-900/10 md:grid-cols-[1.15fr_.85fr]">
        <div className="auth-brand-panel relative overflow-hidden bg-[#003A70] p-8 text-white md:flex md:flex-col md:justify-between md:p-12 lg:p-16">
          <div className="register-sculpture" aria-hidden="true"><i /><i /><i /></div>

          <div className="relative z-10">
            <BrandEyebrow
              variant="onBlue"
              className="text-xl font-semibold tracking-wide sm:text-2xl"
            />
            <h1 className="mt-8 max-w-xl text-5xl font-black leading-[.9] tracking-[-.055em] text-white md:text-7xl">Serviço da Palavra</h1>
            <p className="mt-5 leading-relaxed text-white/80">
              Crie sua conta para acompanhar formações, favoritos, progresso e plano bíblico.
            </p>
          </div>

          <p className="relative z-10 mt-20 max-w-sm text-sm italic text-white/70">“Tua palavra é lâmpada para os meus pés e luz para o meu caminho.”</p>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
