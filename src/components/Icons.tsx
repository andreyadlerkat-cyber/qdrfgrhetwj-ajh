import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Base({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconGithub(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 19c-4 1.5-4-2.5-5-3m10 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-5 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </Base>
  );
}

export function IconTelegram(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9 22 2Z" />
    </Base>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="m4 6 8 7 8-7" />
    </Base>
  );
}

export function IconLink(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l1.91-1.91a5 5 0 0 0-7.07-7.07L11.5 5" />
      <path d="M14 11a5 5 0 0 0-7.54-.54L4.55 12.37a5 5 0 0 0 7.07 7.07L12.5 19" />
    </Base>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Base>
  );
}

export function IconArrowUp(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </Base>
  );
}

export function IconVK(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 7c1 5 4 10 9 10h1V7h-1v6c-3 0-5-3-6-6H3Zm13 0h2c-1 3-2 5-4 6 1 1 3 3 4 4h-3l-3-3v3h-2V7h2v5c2-1 3-3 4-5Z" />
    </Base>
  );
}
