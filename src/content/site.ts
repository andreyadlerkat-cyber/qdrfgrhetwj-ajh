export type SocialLink = {
  id: string;
  label: string;
  href: string;
  kind: "github" | "telegram" | "email" | "vk" | "link" | "music" | "kino";
};

export type Project = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  stack: string[];
  links: {
    demo?: string;
    code?: string;
  };
};

export type ExperienceItem = {
  period: string;
  title: string;
  company?: string;
  bullets: string[];
};

export const site = {
  name: "DSS3D",
  role: "Frontend / Full‑stack developer",
  location: "Россия · удалённо",
  tagline:
    "Делаю быстрые, доступные и аккуратные интерфейсы. Люблю TypeScript, дизайн-системы и автоматизацию.",
  about:
    "Я разработчик, который ценит понятный код, хорошую архитектуру и удобство пользователя. Умею вести задачу от идеи до деплоя: проектирование, UI, интеграции, оптимизация, документация.",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "REST/GraphQL",
    "Testing",
    "CI/CD",
    "Performance & SEO",
    "Accessibility (WCAG)"
  ],
  experience: [
    {
      period: "2024 — сейчас",
      title: "Разработчик веб‑приложений",
      company: "Фриланс / проекты",
      bullets: [
        "Разработка SPA/SSG/SSR приложений на React/Next.js",
        "Компонентный подход и дизайн‑системы",
        "Оптимизация скорости загрузки и SEO",
        "Интеграции со сторонними API"
      ]
    }
  ] satisfies ExperienceItem[],
  projects: [
    {
      id: "portfolio",
      title: "Персональное портфолио (визитка)",
      description:
        "Одностраничное портфолио с секциями, фильтром проектов, формой связи и базовой SEO-разметкой.",
      highlights: [
        "Адаптивная верстка и доступность",
        "Фильтр проектов по технологиям",
        "Форма связи с анти‑спам honeypot"
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      links: {
        demo: "#",
        code: "#"
      }
    },
    {
      id: "dashboard",
      title: "Админ‑панель / Dashboard",
      description:
        "Пример интерфейса с таблицами, фильтрами и визуализацией данных. Подходит для CRM/ERP модулей.",
      highlights: [
        "Структурирование данных и фильтры",
        "Компоненты таблиц и состояния загрузки",
        "UX‑паттерны для админок"
      ],
      stack: ["React", "TypeScript", "Tailwind CSS"],
      links: {
        demo: "#",
        code: "#"
      }
    }
  ] satisfies Project[],
  contacts: [
    {
      id: "email",
      label: "Email",
      href: "mailto:dss3d@example.com",
      kind: "email"
    },
    {
      id: "telegram",
      label: "Telegram",
      href: "https://t.me/",
      kind: "telegram"
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/",
      kind: "github"
    },
    {
      id: "vk",
      label: "VK",
      href: "https://vk.com/",
      kind: "vk"
    }
  ] satisfies SocialLink[]
};
