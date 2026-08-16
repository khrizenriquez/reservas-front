"use client";

import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();
  const labs = t("landing.labs");
  const process = t("landing.process");
  const faq = t("landing.faq");
  return <main aria-labelledby="page-title"><section className="landing-hero"><nav aria-label={t("navigation.primary")}><strong>{t("landing.brand")}</strong><div className="header-controls"><LanguageSelector /><ThemeToggle /></div></nav><div className="landing-copy"><p className="eyebrow">{t("landing.eyebrow")}</p><h1 id="page-title">{t("landing.title")}</h1><p>{t("landing.description")}</p><Link className="button is-primary is-medium" href="/acceso">{t("landing.access")}</Link></div></section><section className="section landing-section" aria-labelledby="labs-title"><p className="eyebrow">{t("landing.spaces")}</p><h2 id="labs-title">{t("landing.labsTitle")}</h2><div className="columns">{labs.map((name, index) => <article className="column" key={name}><div className={`lab-image lab-${index + 1}`} aria-hidden="true" /><h3>{name}</h3><p>{t("landing.labDescription")}</p></article>)}</div></section><section className="section process" aria-labelledby="process-title"><h2 id="process-title">{t("landing.processTitle")}</h2><ol>{process.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ol></section><section className="section landing-section" aria-labelledby="faq-title"><h2 id="faq-title">{t("landing.faqTitle")}</h2>{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section></main>;
}
