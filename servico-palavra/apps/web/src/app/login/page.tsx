import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { BrandEyebrow } from "@/components/branding/BrandEyebrow";

export default function LoginPage() {
  return (
    <main className="prayer-auth min-h-screen overflow-hidden">
      <div className="prayer-grain" aria-hidden="true" />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
        <BrandEyebrow variant="light" className="text-xl font-semibold tracking-wide sm:text-2xl" />
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-[1600px] items-center gap-8 px-6 pb-10 md:px-12 lg:grid-cols-[1.25fr_.75fr] lg:px-16">
        <div className="relative flex min-h-[400px] items-center lg:min-h-[680px]">
          <div className="relative z-10 max-w-3xl">
            <h1 className="prayer-display text-[clamp(4.3rem,9vw,9.5rem)] font-black uppercase leading-[.76] tracking-[-.08em] text-[#003A70]">
              Serviço
              <span className="block font-brand-script normal-case tracking-[-.04em] text-[#E8B900]">da Palavra</span>
            </h1>
            <p className="mt-9 max-w-md border-l-2 border-[#FFCC00] pl-6 text-base leading-7 text-slate-500 md:text-lg">
              Acompanhe formações, favoritos, progresso e sua caminhada espiritual em um só lugar.
            </p>
            <p className="mt-8 text-sm italic text-slate-400">“Ignorar as Escrituras é ignorar Cristo.” — São Jerônimo</p>
          </div>

          <div className="word-sculpture" aria-hidden="true">
            <div className="word-page word-page-one" />
            <div className="word-page word-page-two" />
            <div className="word-page word-page-three" />
            <div className="word-light" />
          </div>
        </div>

        <div className="prayer-login-card mx-auto w-full max-w-[460px] overflow-hidden rounded-[1.75rem]">
          <Suspense><LoginForm /></Suspense>
        </div>
      </section>
    </main>
  );
}
