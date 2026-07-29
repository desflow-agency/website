"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { BarChart3, BriefcaseBusiness, Check, ChevronRight, FileImage, Mail, MessageSquareQuote, Palette, Pencil, Plus, Settings, Tag, Trash2, Users, X } from "lucide-react";
import { money } from "@/lib/utils";

type Tab = "dashboard" | "promotions" | "services" | "portfolio" | "testimonials" | "messages" | "settings";
type Service = { id: string; title: string; description: string; price: number; position: number; icon: string; promotion?: Promotion | null };
type Promotion = { id: string; serviceId: string; percent: number; startsAt: string; endsAt: string; active: boolean; service?: Service };
type Project = { id: string; title: string; client: string; category: string; image: string; description: string; date: string };
type Testimonial = { id: string; name: string; role: string; avatar: string; rating: number; text: string };
type Message = { id: string; name: string; email: string; phone?: string | null; company?: string | null; body: string; status: "UNREAD" | "READ"; createdAt: string };
type SiteSettings = { id: string; name: string; email: string; phone: string; address: string; primaryColor: string; heroTitle: string; ctaTitle: string };

const navigation: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 }, { id: "promotions", label: "Promocje", icon: Tag },
  { id: "services", label: "Oferta", icon: BriefcaseBusiness }, { id: "portfolio", label: "Portfolio", icon: Palette },
  { id: "testimonials", label: "Opinie", icon: MessageSquareQuote }, { id: "messages", label: "Kontakt", icon: Mail },
  { id: "settings", label: "Ustawienia", icon: Settings },
];

export function AdminWorkspace({ userName }: { userName: string }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [services, setServices] = useState<Service[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [serviceEditor, setServiceEditor] = useState<Service | null | undefined>(undefined);
  const [promotionEditor, setPromotionEditor] = useState<Promotion | null | undefined>(undefined);
  const [projectEditor, setProjectEditor] = useState<Project | null | undefined>(undefined);
  const [testimonialEditor, setTestimonialEditor] = useState<Testimonial | null | undefined>(undefined);

  async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, { cache: "no-store", ...init });
    if (!response.ok) throw new Error("Nie udało się zapisać lub pobrać danych.");
    return response.status === 204 ? (undefined as T) : response.json();
  }

  async function load(tabToLoad = tab) {
    setLoading(true);
    try {
      if (tabToLoad === "services") setServices(await api<Service[]>("/api/admin/services"));
      if (tabToLoad === "promotions") { const [nextServices, nextPromotions] = await Promise.all([api<Service[]>("/api/admin/services"), api<Promotion[]>("/api/admin/promotions")]); setServices(nextServices); setPromotions(nextPromotions); }
      if (tabToLoad === "portfolio") setProjects(await api<Project[]>("/api/admin/projects"));
      if (tabToLoad === "testimonials") setTestimonials(await api<Testimonial[]>("/api/admin/testimonials"));
      if (tabToLoad === "messages") setMessages(await api<Message[]>("/api/admin/messages"));
      if (tabToLoad === "settings") setSettings(await api<SiteSettings>("/api/admin/settings"));
    } catch (error) { setNotice(error instanceof Error ? error.message : "Wystąpił nieznany błąd."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (tab !== "dashboard") void load(tab); }, [tab]);
  const navigate = (next: Tab) => { setNotice(null); setTab(next); };
  async function remove(url: string, after: Tab) { if (!confirm("Czy na pewno chcesz trwale usunąć ten element?")) return; try { await api<void>(url, { method: "DELETE" }); setNotice("Element został usunięty."); await load(after); } catch { setNotice("Nie udało się usunąć elementu."); } }
  async function markRead(message: Message) { try { await api(`/api/admin/messages/${message.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: message.status === "READ" ? "UNREAD" : "READ" }) }); await load("messages"); } catch { setNotice("Nie udało się zmienić statusu wiadomości."); } }

  return <main className="min-h-screen bg-[#f7f7fb]">
    <div className="min-h-screen p-4 md:ml-58 md:p-7">
      <aside className="card p-5 md:fixed md:inset-y-0 md:left-0 md:z-40 md:h-screen md:w-58 md:border-y-0 md:border-l-0">
        <b className="text-xl">desflow
        </b>
        <p className="mt-1 text-xs text-[#77798b]">Panel administracyjny</p>
        <nav className="mt-8 grid gap-1" aria-label="Nawigacja panelu">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`flex items-center gap-3 px-3 py-2.5 text-left text-sm transition ${tab === id ? "bg-[#ecebff] font-bold text-[#5b5cf0]" : "text-[#5e6070] hover:bg-[#f4f4f8]"}`}>
          <Icon size={16} />{label}</button>)}</nav>
      </aside>
      <section className="min-w-0">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">{navigation.find((item) => item.id === tab)?.label}</p>
            <h1 className="text-3xl font-bold tracking-tight">{tab === "dashboard" ? `Dzień dobry, ${userName}.` : navigation.find((item) => item.id === tab)?.label}</h1>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">● System online</span>
        </header>
        {notice && <Notice text={notice} close={() => setNotice(null)} />}
        {tab === "dashboard" && <Dashboard navigate={navigate} />}
        {tab === "services" && <ServicesView data={services} loading={loading} add={() => setServiceEditor(null)} edit={setServiceEditor} remove={(id) => void remove(`/api/admin/services/${id}`, "services")} />}
        {tab === "promotions" && <PromotionsView data={promotions} services={services} loading={loading} add={() => setPromotionEditor(null)} edit={setPromotionEditor} remove={(id) => void remove(`/api/admin/promotions/${id}`, "promotions")} />}
        {tab === "portfolio" && <ProjectsView data={projects} loading={loading} add={() => setProjectEditor(null)} edit={setProjectEditor} remove={(id) => void remove(`/api/admin/projects/${id}`, "portfolio")} />}
        {tab === "testimonials" && <TestimonialsView data={testimonials} loading={loading} add={() => setTestimonialEditor(null)} edit={setTestimonialEditor} remove={(id) => void remove(`/api/admin/testimonials/${id}`, "testimonials")} />}
        {tab === "messages" && <MessagesView data={messages} loading={loading} read={markRead} remove={(id) => void remove(`/api/admin/messages/${id}`, "messages")} />}
        {tab === "settings" && <SettingsView data={settings} loading={loading} saved={() => { setNotice("Ustawienia zostały zapisane."); void load("settings"); }} fail={() => setNotice("Nie udało się zapisać ustawień.")} />}
      </section>
    </div>
    {serviceEditor !== undefined && <ServiceEditor value={serviceEditor} close={() => setServiceEditor(undefined)} saved={() => { setServiceEditor(undefined); setNotice("Usługa została zapisana."); void load("services"); }} fail={() => setNotice("Nie udało się zapisać usługi.")} />}
    {promotionEditor !== undefined && <PromotionEditor value={promotionEditor} services={services} close={() => setPromotionEditor(undefined)} saved={() => { setPromotionEditor(undefined); setNotice("Promocja została zapisana."); void load("promotions"); }} fail={() => setNotice("Nie udało się zapisać promocji.")} />}
    {projectEditor !== undefined && <ProjectEditor value={projectEditor} close={() => setProjectEditor(undefined)} saved={() => { setProjectEditor(undefined); setNotice("Projekt został zapisany."); void load("portfolio"); }} fail={() => setNotice("Nie udało się zapisać projektu.")} />}
    {testimonialEditor !== undefined && <TestimonialEditor value={testimonialEditor} close={() => setTestimonialEditor(undefined)} saved={() => { setTestimonialEditor(undefined); setNotice("Opinia została zapisana."); void load("testimonials"); }} fail={setNotice} />}
  </main>;
}

function Dashboard({ navigate }: { navigate: (tab: Tab) => void }) {
  const stats: [string, Tab, typeof Mail][] = [["Wiadomości", "messages", Mail], ["Promocje", "promotions", Tag], ["Projekty", "portfolio", FileImage], ["Opinie", "testimonials", MessageSquareQuote]]; return <>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, destination, Icon]) => <button key={label} onClick={() => navigate(destination)} className="card p-5 text-left transition hover:-translate-y-1">
      <Icon size={18} className="text-[#5b5cf0]" />
      <p className="mt-6 font-bold">{label}</p>
      <p className="mt-1 text-sm text-[#686b7d]">Otwórz sekcję <ChevronRight className="inline" size={14} />
      </p>
    </button>)}</div>
    <article className="card mt-5 p-6">
      <h2 className="font-bold">Panel jest gotowy do pracy</h2>
      <p className="mt-2 text-sm text-[#686b7d]">Dodawaj i edytuj ofertę, promocje, projekty oraz opinie. Dane są zapisywane w SQLite przez Prisma.</p>
      <button className="btn btn-primary mt-5" onClick={() => navigate("services")}>Dodaj usługę <Plus size={16} />
      </button>
    </article>
  </>
}
function ServicesView({ data, loading, add, edit, remove }: { data: Service[]; loading: boolean; add: () => void; edit: (item: Service) => void; remove: (id: string) => void }) {
  return <>
    <Action label="Dodaj usługę" onClick={add} />
    <div className="mt-5 grid gap-4 lg:grid-cols-2">{loading ? <Loading /> : data.length === 0 ? <Empty text="Nie masz jeszcze żadnych usług." /> : data.map((item) => <article className="card p-6" key={item.id}>
      <div className="flex justify-between gap-3">
        <div>
          <h2 className="font-bold">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#686b7d]">{item.description}</p>
        </div>{item.promotion?.active && <span className="h-fit rounded-full bg-[#ecebff] px-3 py-1 text-xs font-bold text-[#5b5cf0]">−{item.promotion.percent}%</span>}</div>
      <p className="mt-5 font-bold">od {money(item.price)}</p>
      <RowActions edit={() => edit(item)} remove={() => remove(item.id)} />
    </article>)}</div>
  </>
}
function PromotionsView({ data, services, loading, add, edit, remove }: { data: Promotion[]; services: Service[]; loading: boolean; add: () => void; edit: (item: Promotion) => void; remove: (id: string) => void }) {
  return <>
    <Action label="Dodaj promocję" onClick={add} disabled={!services.length} />
    <div className="mt-5 grid gap-4">{loading ? <Loading /> : data.length === 0 ? <Empty text={services.length ? "Nie masz jeszcze promocji." : "Najpierw dodaj usługę w sekcji Oferta."} /> : data.map((item) => <article key={item.id} className="card flex flex-wrap items-center justify-between gap-4 p-6">
      <div>
        <h2 className="font-bold">{item.service?.title || "Usługa"}</h2>
        <p className="mt-1 text-sm text-[#686b7d]">{date(item.startsAt)} – {date(item.endsAt)} · {item.active ? "Aktywna" : "Nieaktywna"}</p>
      </div>
      <div className="flex items-center gap-4">
        <b className="rounded-full bg-[#ecebff] px-4 py-2 text-[#5b5cf0]">−{item.percent}%</b>
        <RowActions edit={() => edit(item)} remove={() => remove(item.id)} />
      </div>
    </article>)}</div>
  </>
}
function ProjectsView({ data, loading, add, edit, remove }: { data: Project[]; loading: boolean; add: () => void; edit: (item: Project) => void; remove: (id: string) => void }) {
  return <>
    <Action label="Dodaj projekt" onClick={add} />
    <div className="mt-5 grid gap-4 md:grid-cols-2">{loading ? <Loading /> : data.length === 0 ? <Empty text="Nie masz jeszcze projektów w portfolio." /> : data.map((item) => <article className="card overflow-hidden" key={item.id}>
      <img className="h-36 w-full object-cover" src={item.image} alt="" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#5b5cf0]">{item.category}</p>
        <h2 className="mt-1 font-bold">{item.title}</h2>
        <p className="mt-1 text-sm text-[#686b7d]">{item.client}</p>
        <RowActions edit={() => edit(item)} remove={() => remove(item.id)} />
      </div>
    </article>)}</div>
  </>
}
function TestimonialsView({ data, loading, add, edit, remove }: { data: Testimonial[]; loading: boolean; add: () => void; edit: (item: Testimonial) => void; remove: (id: string) => void }) {
  return <>
    <Action label="Dodaj opinię" onClick={add} />
    <div className="mt-5 grid gap-4 md:grid-cols-2">{loading ? <Loading /> : data.length === 0 ? <Empty text="Nie masz jeszcze opinii klientów." /> : data.map((item) => <article className="card p-6" key={item.id}>
      <div className="flex items-center gap-3">
        <img className="h-10 w-10 rounded-full object-cover" src={item.avatar} alt="" />
        <div>
          <h2 className="font-bold">{item.name}</h2>
          <p className="text-sm text-[#686b7d]">{item.role}</p>
        </div>
      </div>
      <p className="mt-4 text-[#e7972a]">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</p>
      <p className="mt-3 text-sm leading-6">„{item.text}”</p>
      <RowActions edit={() => edit(item)} remove={() => remove(item.id)} />
    </article>)}</div>
  </>
}
function MessagesView({ data, loading, read, remove }: { data: Message[]; loading: boolean; read: (item: Message) => void; remove: (id: string) => void }) {
  return <div className="grid gap-3">{loading ? <Loading /> : data.length === 0 ? <Empty text="Brak wiadomości z formularza kontaktowego." /> : data.map((item) => <article className="card p-6" key={item.id}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-bold">{item.name}</h2>{item.status === "UNREAD" && <span className="rounded-full bg-[#ecebff] px-2 py-0.5 text-xs font-bold text-[#5b5cf0]">Nowa</span>}</div>
        <p className="mt-1 text-sm text-[#686b7d]">{item.email}{item.company ? ` · ${item.company}` : ""}</p>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-light px-3 py-2 text-sm" onClick={() => read(item)}>{item.status === "READ" ? "Oznacz jako nową" : "Oznacz jako przeczytaną"}</button>
        <IconButton label="Usuń wiadomość" onClick={() => remove(item.id)}>
          <Trash2 size={16} />
        </IconButton>
      </div>
    </div>
    <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{item.body}</p>
  </article>)}</div>
}
function SettingsView({ data, loading, saved, fail }: { data: SiteSettings | null; loading: boolean; saved: () => void; fail: () => void }) {
  if (loading || !data) return <Loading />; async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }); if (!response.ok) throw new Error(); saved(); } catch { fail(); } } return <form className="card grid gap-5 p-6 md:grid-cols-2" onSubmit={submit}>
    <h2 className="md:col-span-2 text-xl font-bold">Ustawienia marki</h2>
    <Field label="Nazwa firmy" name="name" defaultValue={data.name} />
    <Field label="E-mail" name="email" type="email" defaultValue={data.email} />
    <Field label="Telefon" name="phone" defaultValue={data.phone} />
    <Field label="Adres" name="address" defaultValue={data.address} />
    <Field label="Kolor główny" name="primaryColor" type="color" defaultValue={data.primaryColor} />
    <Field label="Tekst hero" name="heroTitle" defaultValue={data.heroTitle} />
    <div className="md:col-span-2">
      <Field label="Nagłówek CTA" name="ctaTitle" defaultValue={data.ctaTitle} />
    </div>
    <button className="btn btn-primary justify-center md:col-span-2" type="submit">
      <Check size={16} />Zapisz ustawienia</button>
  </form>
}

function ServiceEditor({ value, close, saved, fail }: { value: Service | null; close: () => void; saved: () => void; fail: () => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const body = { title: form.get("title"), description: form.get("description"), price: Number(form.get("price")), icon: "Sparkles", position: value?.position || 0 }; try { const response = await fetch(value ? `/api/admin/services/${value.id}` : "/api/admin/services", { method: value ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(); saved(); } catch { fail(); } } return <Modal title={value ? "Edytuj usługę" : "Nowa usługa"} close={close}>
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Nazwa" name="title" defaultValue={value?.title} />
      <Field label="Opis" name="description" defaultValue={value?.description} textarea />
      <Field label="Cena od (PLN)" name="price" type="number" defaultValue={value?.price} />
      <SaveButton />
    </form>
  </Modal>
}
function PromotionEditor({ value, services, close, saved, fail }: { value: Promotion | null; services: Service[]; close: () => void; saved: () => void; fail: () => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const body = value ? { percent: Number(form.get("percent")), startsAt: form.get("startsAt"), endsAt: form.get("endsAt"), active: form.get("active") === "on" } : { serviceId: form.get("serviceId"), percent: Number(form.get("percent")), startsAt: form.get("startsAt"), endsAt: form.get("endsAt"), active: true }; try { const response = await fetch(value ? `/api/admin/promotions/${value.id}` : "/api/admin/promotions", { method: value ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(); saved(); } catch { fail(); } } return <Modal title={value ? "Edytuj promocję" : "Nowa promocja"} close={close}>{services.length === 0 ? <p className="text-sm text-[#686b7d]">Najpierw dodaj usługę.</p> : <form className="grid gap-4" onSubmit={submit}>{!value && <label className="grid gap-1 text-sm font-medium">Usługa<select className="rounded-xl border border-[#e1e1e9] bg-white p-3" name="serviceId">{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select>
  </label>}<Field label="Rabat (%)" name="percent" type="number" defaultValue={value?.percent} />
    <Field label="Data rozpoczęcia" name="startsAt" type="datetime-local" defaultValue={dateTime(value?.startsAt)} />
    <Field label="Data zakończenia" name="endsAt" type="datetime-local" defaultValue={dateTime(value?.endsAt)} />{value && <label className="flex gap-2 text-sm">
      <input className="w-auto" type="checkbox" name="active" defaultChecked={value.active} />Aktywna</label>}<SaveButton />
  </form>}</Modal>
}
function ProjectEditor({ value, close, saved, fail }: { value: Project | null; close: () => void; saved: () => void; fail: () => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const response = await fetch(value ? `/api/admin/projects/${value.id}` : "/api/admin/projects", { method: value ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }); if (!response.ok) throw new Error(); saved(); } catch { fail(); } } return <Modal title={value ? "Edytuj projekt" : "Dodaj projekt"} close={close}>
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Nazwa projektu" name="title" defaultValue={value?.title} />
      <Field label="Klient" name="client" defaultValue={value?.client} />
      <Field label="Kategoria" name="category" defaultValue={value?.category} />
      <Field label="Adres obrazu" name="image" type="url" defaultValue={value?.image} />
      <Field label="Opis" name="description" defaultValue={value?.description} textarea />
      <Field label="Data" name="date" type="date" defaultValue={dateInput(value?.date)} />
      <SaveButton />
    </form>
  </Modal>
}
function TestimonialEditor({ value, close, saved, fail }: { value: Testimonial | null; close: () => void; saved: () => void; fail: (message: string) => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const body = { ...Object.fromEntries(form), rating: Number(form.get("rating")) }; try { const response = await fetch(value ? `/api/admin/testimonials/${value.id}` : "/api/admin/testimonials", { method: value ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) { const result = await response.json().catch(() => null); throw new Error(result?.error || "Nie udało się zapisać opinii."); } saved(); } catch (error) { fail(error instanceof Error ? error.message : "Nie udało się zapisać opinii."); } } return <Modal title={value ? "Edytuj opinię" : "Dodaj opinię"} close={close}>
    <form className="grid gap-4" onSubmit={submit}>
      <Field label="Imię i nazwisko" name="name" defaultValue={value?.name} />
      <Field label="Rola / firma" name="role" defaultValue={value?.role} />
      <Field label="Adres avatara (opcjonalnie)" name="avatar" type="url" defaultValue={value?.avatar} required={false} />
      <Field label="Ocena (1–5)" name="rating" type="number" defaultValue={value?.rating || 5} />
      <Field label="Treść opinii" name="text" defaultValue={value?.text} textarea />
      <SaveButton />
    </form>
  </Modal>
}

function Action({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) {
  return <div className="flex justify-end">
    <button className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={onClick} disabled={disabled}>
      <Plus size={16} />{label}</button>
  </div>
}
function RowActions({ edit, remove }: { edit: () => void; remove: () => void }) {
  return <div className="mt-5 flex gap-2">
    <button className="btn btn-light px-3 py-2 text-sm" onClick={edit}>
      <Pencil size={15} />Edytuj</button>
    <IconButton label="Usuń" onClick={remove}>
      <Trash2 size={16} />
    </IconButton>
  </div>
}
function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) { return <button className="grid h-10 w-10 place-items-center rounded-full border border-[#e1e1e9] text-[#686b7d] hover:border-red-200 hover:bg-red-50 hover:text-red-600" aria-label={label} title={label} onClick={onClick}>{children}</button> }
function Field({ label, name, defaultValue = "", type = "text", textarea = false, required = true }: { label: string; name: string; defaultValue?: string | number; type?: string; textarea?: boolean; required?: boolean }) { return <label className="grid gap-1 text-sm font-medium">{label}{textarea ? <textarea required={required} name={name} rows={4} defaultValue={String(defaultValue)} /> : <input required={required} name={name} type={type} defaultValue={String(defaultValue)} />}</label> }
function Modal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#11132280] p-4">
    <section className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={close} aria-label="Zamknij">
          <X />
        </button>
      </div>{children}</section>
  </div>
}
function SaveButton() {
  return <button className="btn btn-primary justify-center" type="submit">
    <Check size={16} />Zapisz</button>
}
function Notice({ text, close }: { text: string; close: () => void }) {
  return <div className="mb-5 flex items-center justify-between rounded-xl border border-[#cfd0ff] bg-[#eeeeff] p-4 text-sm text-[#38397e]">
    <span>{text}</span>
    <button aria-label="Zamknij komunikat" onClick={close}>
      <X size={16} />
    </button>
  </div>
}
function Empty({ text }: { text: string }) { return <article className="card p-8 text-center text-sm text-[#686b7d]">{text}</article> }
function Loading() { return <article className="card p-8 text-center text-sm text-[#686b7d]">Ładowanie danych…</article> }
function date(value?: string) { return value ? new Date(value).toLocaleDateString("pl-PL") : "—"; }
function dateTime(value?: string) { return value ? new Date(value).toISOString().slice(0, 16) : ""; }
function dateInput(value?: string) { return value ? new Date(value).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10); }
