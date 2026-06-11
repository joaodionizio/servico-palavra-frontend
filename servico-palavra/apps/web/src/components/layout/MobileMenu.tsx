import Link from "next/link";

const items = [
  ["Início", "/app/dashboard"],
  ["Formações", "/app/formacoes"],
  ["Trilhas", "/app/trilhas"],
  ["Plano", "/app/plano-biblico"]
];

export function MobileMenu() {
  return (
    <nav className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3 md:hidden">
      {items.map(([label, href]) => (
        <Link key={href} href={href} className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-gray-500 transition hover:bg-blue-50 hover:text-[#004B87]">
          {label}
        </Link>
      ))}
    </nav>
  );
}
