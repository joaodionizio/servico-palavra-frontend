import { TrailForm } from "@/components/admin/TrailForm";

export default function NovaTrilhaPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#FFCC00]">Admin</p>
        <h1 className="mt-3 text-3xl font-black text-[#004B87]">Nova trilha</h1>
      </section>
      <TrailForm />
    </div>
  );
}
