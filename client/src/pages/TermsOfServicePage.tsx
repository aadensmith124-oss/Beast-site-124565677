import { Link } from "wouter";

const terms = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.",
  },
  {
    title: "2. Use License",
    content:
      "Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only.",
  },
  {
    title: "3. User Account",
    content:
      "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
  },
  {
    title: "4. Prohibited Uses",
    content:
      "You may not use our service in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service.",
  },
  {
    title: "5. Limitation of Liability",
    content:
      "In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials on our service.",
  },
  {
    title: "6. Changes to Terms",
    content:
      "We reserve the right to revise these terms of service at any time without notice. By using this service you are agreeing to be bound by the then current version of these terms of service.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:py-12">
      <main className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          ← Back to GorillaCC
        </Link>

        <article className="rounded-2xl border border-white/10 bg-[#111711] p-5 shadow-xl sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-white/45">Last updated: 2026-11-16</p>

          <div className="mt-8 space-y-7">
            {terms.map(({ title, content }) => (
              <section key={title} aria-labelledby={`terms-${title.slice(3).replaceAll(" ", "-")}`}>
                <h2
                  id={`terms-${title.slice(3).replaceAll(" ", "-")}`}
                  className="text-base font-semibold text-white sm:text-lg"
                >
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/65">{content}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
