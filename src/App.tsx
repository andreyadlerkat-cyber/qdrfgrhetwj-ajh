"use client";

import * as React from "react";
import { site, type Project } from "@/content/site";
import { IconArrowUp, IconClose, IconGithub, IconLink, IconMail, IconTelegram, IconVK } from "@/components/Icons";
import { Badge, Button, ButtonLink, Card, Container } from "@/components/ui";
import { cn } from "@/utils/cn";

const SECTIONS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "Обо мне" },
  { id: "projects", label: "Проекты" },
  { id: "contacts", label: "Контакты" }
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

type ToastState = null | { title: string; description?: string };

function useActiveSection() {
  const [active, setActive] = React.useState<SectionId>("home");

  React.useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const first = visible[0];
        if (first?.target?.id) setActive(first.target.id as SectionId);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px"
      }
    );

    for (const el of elements) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return active;
}

function SocialIcon({ kind, className }: { kind: string; className?: string }) {
  const props = { className: cn("h-4 w-4", className) };
  switch (kind) {
    case "github":
      return <IconGithub {...props} />;
    case "telegram":
      return <IconTelegram {...props} />;
    case "email":
      return <IconMail {...props} />;
    case "vk":
      return <IconVK {...props} />;
    default:
      return <IconLink {...props} />;
  }
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function formatMailto({
  to,
  subject,
  body
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${to}?${params.toString()}`;
}

function ProjectModal({
  project,
  onClose
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Проект: ${project.title}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card className="w-full max-w-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">{project.title}</h3>
            <p className="mt-1 text-sm text-white/65">{project.description}</p>
          </div>
          <Button
            ref={closeBtnRef}
            variant="ghost"
            onClick={onClose}
            aria-label="Закрыть"
            className="shrink-0"
          >
            <IconClose className="h-4 w-4" />
            <span className="sr-only">Закрыть</span>
          </Button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <ul className="space-y-2 text-sm text-white/80">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            {project.links.demo ? (
              <ButtonLink
                href={project.links.demo}
                target={project.links.demo.startsWith("http") ? "_blank" : undefined}
                rel={project.links.demo.startsWith("http") ? "noreferrer" : undefined}
                variant="primary"
              >
                <IconLink className="h-4 w-4" />
                Демо
              </ButtonLink>
            ) : null}
            {project.links.code ? (
              <ButtonLink
                href={project.links.code}
                target={project.links.code.startsWith("http") ? "_blank" : undefined}
                rel={project.links.code.startsWith("http") ? "noreferrer" : undefined}
              >
                <IconGithub className="h-4 w-4" />
                Код
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const active = useActiveSection();

  const allTags = React.useMemo(() => {
    const tags = site.projects.flatMap((p) => p.stack);
    return uniq(tags).sort((a, b) => a.localeCompare(b, "ru"));
  }, []);

  const [tag, setTag] = React.useState<string>("Все");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Project | null>(null);
  const [toast, setToast] = React.useState<ToastState>(null);

  const [showTop, setShowTop] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProjects = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return site.projects.filter((p) => {
      const matchTag = tag === "Все" || p.stack.includes(tag);
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q));
      return matchTag && matchQuery;
    });
  }, [query, tag]);

  const emailHref = site.contacts.find((c) => c.kind === "email")?.href ?? "mailto:dss3d@example.com";
  const emailTo = emailHref.replace(/^mailto:/, "");

  return (
    <div className="min-h-screen text-white">
      <a href="#home" className="skip-link rounded-lg bg-white/10 px-3 py-2 text-sm text-white/90">
        Пропустить к содержимому
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070a12]/80 backdrop-blur">
        <Container className="flex items-center justify-between py-3">
          <a
            href="#home"
            className="group inline-flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/90 to-fuchsia-500/90 shadow-lg shadow-indigo-500/10">
              <span className="text-sm font-semibold tracking-tight">D3</span>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-white">{site.name}</span>
              <span className="block text-xs text-white/60">{site.role}</span>
            </span>
          </a>

          <nav aria-label="Навигация" className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
                    isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href="#contacts" variant="primary" className="hidden sm:inline-flex">
              Связаться
            </ButtonLink>
          </div>
        </Container>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="scroll-mt-24 py-14 sm:py-18">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div className="space-y-6">
                <div className="inline-flex flex-wrap items-center gap-2">
                  <Badge className="bg-indigo-500/15 text-indigo-200">Доступен для проектов</Badge>
                  <Badge>{site.location}</Badge>
                </div>

                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  {site.name}
                  <span className="text-white/50"> — {site.role}</span>
                </h1>
                <p className="max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
                  {site.tagline}
                </p>

                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="#projects" variant="primary">
                    Смотреть проекты
                  </ButtonLink>
                  <ButtonLink href="#about">Обо мне</ButtonLink>
                  <ButtonLink href={emailHref}>
                    <IconMail className="h-4 w-4" />
                    Email
                  </ButtonLink>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {site.skills.slice(0, 8).map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </div>

              <Card className="p-5">
                <h2 className="text-sm font-semibold text-white">Коротко</h2>
                <p className="mt-2 text-sm text-white/70">{site.about}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Фокус</div>
                    <div className="mt-1 text-sm text-white/85">UI, DX, perf/SEO</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Формат</div>
                    <div className="mt-1 text-sm text-white/85">SSG/SSR, SPA</div>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* ABOUT */}
        <section id="about" className="scroll-mt-24 py-14 sm:py-18">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Обо мне</h2>
                <p className="mt-2 max-w-3xl text-sm text-white/70">
                  Резюме в формате «что делаю / чем полезен / как работаю».
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-white">Навыки</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {site.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-white">Опыт</h3>
                <ol className="mt-4 space-y-4">
                  {site.experience.map((e) => (
                    <li key={`${e.period}-${e.title}`} className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="text-sm font-medium text-white">
                          {e.title}
                          {e.company ? <span className="text-white/50"> · {e.company}</span> : null}
                        </div>
                        <div className="text-xs text-white/60">{e.period}</div>
                      </div>
                      <ul className="space-y-1 text-sm text-white/70">
                        {e.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          </Container>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-24 py-14 sm:py-18">
          <Container>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Проекты</h2>
                <p className="mt-2 max-w-3xl text-sm text-white/70">
                  Подборка работ: карточки, стек, ссылки на демо/код. Структура легко расширяется через
                  <span className="font-medium text-white/80"> src/content/site.ts</span>.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="text-sm text-white/70">
                  <span className="sr-only">Поиск</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по проектам…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Все", ...allTags].map((t) => {
                const selectedTag = tag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      selectedTag
                        ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-100"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filteredProjects.map((p) => (
                <Card key={p.id} className="group p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">{p.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{p.description}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setSelected(p)}>
                      Подробнее
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.stack.slice(0, 6).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {p.links.demo ? (
                      <a
                        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
                        href={p.links.demo}
                        target={p.links.demo.startsWith("http") ? "_blank" : undefined}
                        rel={p.links.demo.startsWith("http") ? "noreferrer" : undefined}
                      >
                        <IconLink className="h-4 w-4" />
                        Демо
                      </a>
                    ) : null}
                    {p.links.code ? (
                      <a
                        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
                        href={p.links.code}
                        target={p.links.code.startsWith("http") ? "_blank" : undefined}
                        rel={p.links.code.startsWith("http") ? "noreferrer" : undefined}
                      >
                        <IconGithub className="h-4 w-4" />
                        Код
                      </a>
                    ) : null}
                  </div>
                </Card>
              ))}

              {filteredProjects.length === 0 ? (
                <Card className="p-5 md:col-span-2">
                  <p className="text-sm text-white/70">Ничего не найдено. Попробуй изменить фильтр или запрос.</p>
                </Card>
              ) : null}
            </div>
          </Container>
        </section>

        {/* CONTACTS */}
        <section id="contacts" className="scroll-mt-24 py-14 sm:py-18">
          <Container>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Контакты</h2>
              <p className="mt-2 max-w-3xl text-sm text-white/70">
                Быстрые ссылки и форма для сообщения (откроет ваш почтовый клиент через mailto).
              </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-white">Ссылки</h3>
                <div className="mt-4 grid gap-2">
                  {site.contacts.map((c) => (
                    <a
                      key={c.id}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                          <SocialIcon kind={c.kind} className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-white">{c.label}</span>
                      </span>
                      <span className="text-xs text-white/50">Открыть</span>
                    </a>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-white">Написать сообщение</h3>
                <ContactForm
                  emailTo={emailTo}
                  onToast={(t) => {
                    setToast(t);
                    window.setTimeout(() => setToast(null), 3500);
                  }}
                />
              </Card>
            </div>

            <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span>© {new Date().getFullYear()} {site.name}. Все права защищены.</span>
                <span className="inline-flex items-center gap-2">
                  <a className="inline-flex items-center gap-2 hover:text-white" href="#home">
                    <IconArrowUp className="h-4 w-4" />
                    Наверх
                  </a>
                </span>
              </div>
            </footer>
          </Container>
        </section>
      </main>

      {selected ? <ProjectModal project={selected} onClose={() => setSelected(null)} /> : null}

      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3 text-white/90 backdrop-blur transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          aria-label="Наверх"
        >
          <IconArrowUp className="h-5 w-5" />
        </button>
      ) : null}

      {toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2">
          <div className="rounded-2xl border border-white/10 bg-[#0b1020]/90 p-4 text-sm shadow-xl shadow-black/30 backdrop-blur">
            <div className="font-medium text-white">{toast.title}</div>
            {toast.description ? <div className="mt-1 text-white/70">{toast.description}</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ContactForm({
  emailTo,
  onToast
}: {
  emailTo: string;
  onToast: (t: ToastState) => void;
}) {
  const [name, setName] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [company, setCompany] = React.useState(""); // honeypot

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim().length > 0) {
      onToast({ title: "Сообщение отправлено" });
      return;
    }

    const subject = `Сообщение для ${site.name} — ${name || "без имени"}`;
    const body = [
      `Имя: ${name || "—"}`,
      `Контакт: ${from || "—"}`,
      "",
      message || "(сообщение пустое)"
    ].join("\n");

    const href = formatMailto({ to: emailTo, subject, body });
    window.location.href = href;

    onToast({
      title: "Открываю почтовый клиент…",
      description: "Если ничего не произошло — проверьте наличие почтового клиента или используйте ссылки слева."
    });
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs text-white/60">
          Имя
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Как к вам обращаться"
            autoComplete="name"
          />
        </label>
        <label className="grid gap-1 text-xs text-white/60">
          Контакт
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="Email/Telegram"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="grid gap-1 text-xs text-white/60">
        Сообщение
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-28 resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
          placeholder="Коротко опишите задачу или предложение"
        />
      </label>

      {/* Honeypot field (hidden from users) */}
      <label className="hidden">
        Company
        <input value={company} onChange={(e) => setCompany(e.target.value)} tabIndex={-1} autoComplete="off" />
      </label>

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" variant="primary">
          Отправить
        </Button>
        <ButtonLink href={`mailto:${emailTo}`}>
          <IconMail className="h-4 w-4" />
          Написать напрямую
        </ButtonLink>
      </div>

      <p className="text-xs text-white/50">
        Форма не хранит данные на сервере: сообщение отправляется через ваш почтовый клиент.
      </p>
    </form>
  );
}
