import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/login" className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FFCC00]">Serviço</span>
          <span className="text-xl font-black text-[#004B87]">Serviço da Palavra</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link href="/login" className="rounded-full px-4 py-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]">
            Entrar
          </Link>
          <Link href="/cadastro" className="rounded-full bg-[#004B87] px-5 py-2 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#003366] hover:shadow-md">
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
