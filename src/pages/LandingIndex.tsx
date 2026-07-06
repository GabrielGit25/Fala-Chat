import { useRef } from 'react';
import ChatWidget, { type ChatWidgetHandle } from '../components/ChatWidget';

type IconProps = {
  className?: string;
};

function LogoMark() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <svg viewBox="0 0 24 24" className="h-9 w-9 shrink-0 sm:h-12 sm:w-12 md:h-14 md:w-14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="brand-orange" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffbf5c" />
            <stop offset="100%" stopColor="#f0891a" />
          </linearGradient>
        </defs>
        <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="url(#brand-orange)" />
        <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" stroke="#f8fafc" />
        <path d="M8 6v8" stroke="#9ec5ff" />
      </svg>
      <div className="leading-none">
        <p className="text-base tracking-tight text-white sm:text-xl md:text-2xl">
          <span className="font-black">defesa</span>
          <span className="font-light text-slate-300"> do consumidor</span>
        </p>
        <p className="hidden sm:block mt-1 text-[0.58rem] font-medium uppercase tracking-[0.38em] text-slate-300 sm:text-[0.62rem]">canal de atendimento</p>
      </div>
    </div>
  );
}

function SectionEyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.28em] ${
        light
          ? "border-white/15 bg-white/10 text-slate-100"
          : "border-[#d8e2f2] bg-white text-[#24508f]"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${light ? "bg-[#f89d20]" : "bg-[#2c69b1]"}`} />
      {children}
    </div>
  );
}

function Swoosh() {
  return (
    <svg viewBox="0 0 180 24" className="mt-3 h-4 w-36 text-[#f89d20]" aria-hidden="true">
      <path d="M4 15C38 9 72 7 107 7c16 0 34 1 69 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 20c24-3 43-3 79-1" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ReceiptIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 3h10v18l-2-1.5L12 21l-3-1.5L7 21V3z" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12h5" />
      <path d="M9.5 16h3" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M21 16.5v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h2a2 2 0 0 1 2 1.7l.4 2.7a2 2 0 0 1-.6 1.8l-1.4 1.4a16 16 0 0 0 5.7 5.7l1.4-1.4a2 2 0 0 1 1.8-.6l2.7.4A2 2 0 0 1 21 16.5z" />
    </svg>
  );
}

function CarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 12l1.5-4.5A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.5L19 12" />
      <path d="M4 12h16a1 1 0 0 1 1 1v4h-2" />
      <path d="M3 17H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1" />
      <circle cx="7.5" cy="17" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
      <path d="M9.3 17h5.4" />
    </svg>
  );
}

function BookIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
      <path d="M4 19a2 2 0 0 1 2-2h13" />
      <path d="M9 7h6" />
    </svg>
  );
}

function BoxIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 8l9-4.5L21 8v8l-9 4.5L3 16V8z" />
      <path d="M3 8l9 4.5L21 8" />
      <path d="M12 12.5V21" />
    </svg>
  );
}

function MailIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function EarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 10a6 6 0 1 1 12 0c0 3-2 4-3.2 5.4-.9 1-.8 2.3-1.6 3.6a3.3 3.3 0 0 1-5.7-.6" />
      <path d="M9.5 10a2.5 2.5 0 0 1 5 0c0 1.5-1.2 2-2 3" />
    </svg>
  );
}

function HeartIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 20.5S4 15 4 9.5A4.5 4.5 0 0 1 12 6.7a4.5 4.5 0 0 1 8 2.8c0 5.5-8 11-8 11z" />
    </svg>
  );
}

function FistIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 11V7.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M10 10.5v-4a1.5 1.5 0 0 1 3 0v4" />
      <path d="M13 10.5V7a1.5 1.5 0 0 1 3 0v4.5" />
      <path d="M16 11.2V9a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-2.5a1.5 1.5 0 0 1 3 0" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M14 8h2.5V5H14a4 4 0 0 0-4 4v2H7.5v3H10v6h3v-6h2.5l.5-3H13V9a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 20a8 8 0 1 0-4.3-1.3L5 21l2.5-2A8 8 0 0 0 12 20z" />
      <path d="M9.5 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.4 1c.2.4 0 .6-.1.8l-.4.5c-.1.1-.2.3 0 .6a5.8 5.8 0 0 0 2.7 2.5c.3.2.5.1.7 0l.6-.7c.2-.2.4-.2.8-.1l1 .5c.4.2.4.3.4.6v.5c0 .3-.1.5-.5.7-.4.2-.9.4-1.5.3-1.4-.2-3-.9-4.5-2.3-1.4-1.4-2.1-2.8-2.3-4.2-.1-.6.1-1.2.4-1.7z" />
    </svg>
  );
}

function ArrowUpIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  );
}

function QuoteIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 7c-3 1-5 3.5-5 7v3h5v-5H7.5c.2-2 1.3-3.4 3-4.2L10 7zm9 0c-3 1-5 3.5-5 7v3h5v-5h-2.5c.2-2 1.3-3.4 3-4.2L19 7z" />
    </svg>
  );
}

const navLinks = [
  { label: "Quem é Librelon?", href: "#quem-somos" },
  { label: "Já passou por isso?", href: "#problemas" },
  { label: "Gabinete Itinerante", href: "#gabinete" },
  { label: "Orientações", href: "#orientacoes" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

const socialLinks = [
  { label: "Instagram", href: "#contato", icon: InstagramIcon },
  { label: "Facebook", href: "#contato", icon: FacebookIcon },
  { label: "WhatsApp", href: "#contato", icon: WhatsAppIcon },
  { label: "E-mail", href: "#contato", icon: MailIcon },
];

const problems = [
  {
    title: "Troca de produto com defeito",
    pain: "O consumidor perde tempo com reclamações, fica sem o produto e, muitas vezes, assume o prejuízo.",
    icon: BoxIcon,
  },
  {
    title: "Falta de documentação em automóveis",
    pain: "Não poder ser vendido ou usado com tranquilidade, o veículo gera insegurança e transtornos diários.",
    icon: CarIcon,
  },
  {
    title: "Cobrança abusiva em contrato de cursos",
    pain: "Compromete o orçamento familiar, gerando pressão e falta de informação.",
    icon: BookIcon,
  },
  {
    title: "Recebimento de produto diferente do ofertado",
    pain: "O consumidor paga por uma expectativa e recebe algo inferior, sentindo-se enganado e lesado na compra.",
    icon: ReceiptIcon,
  },
];

const gabinetePillars = [
  {
    title: "Ouvir",
    description: "sua demanda com atenção, onde quer que você esteja: no bairro, na comunidade ou no comércio local.",
    icon: EarIcon,
  },
  {
    title: "Entender",
    description: "sua dor de perto, porque quem paga a conta não pode ser tratado como mais um número de protocolo.",
    icon: HeartIcon,
  },
  {
    title: "Lutar",
    description: "pelo seu direito na lei, na TV e na rua, cobrando solução de quem falhou com o consumidor.",
    icon: FistIcon,
  },
];

const categories = [
  { label: "Prestação de serviços", value: 42.7, color: "#4da3f5" },
  { label: "Veículos", value: 30.3, color: "#4caf50" },
  { label: "Produtos e garantia", value: 17.9, color: "#f89d20" },
  { label: "Outros", value: 9.2, color: "#e05252" },
];

const basicSteps = [
  {
    step: "01",
    title: "Registre protocolo",
    description: "Não fique apenas na conversa informal. Sempre peça e anote o número do protocolo de atendimento.",
  },
  {
    step: "02",
    title: "Tire foto de tudo",
    description: "Fotografe a conta, o produto com defeito e qualquer evidência do problema no momento em que acontecer.",
  },
  {
    step: "03",
    title: "Guarde os documentos",
    description: "Nota fiscal, print, contrato, comprovante de pagamento e mensagens trocadas com a empresa.",
  },
  {
    step: "04",
    title: "Cobre a solução",
    description: "Esses documentos ajudam o consumidor a provar o que aconteceu e buscar seus direitos.",
  },
];

const testimonials = [
  {
    quote:
      "Comprei um carro e dei o meu veículo de entrada, mas fiquei 15 dias tentando resolver a situação. Meu marido precisava trabalhar, as crianças precisavam ir para a escola, enfim... Além do prejuízo financeiro, teve o desgaste emocional, a preocupação e a sensação de impotência por tentar resolver e não ter resposta. Mas depois que a equipe do Librelon entrou no caso, eu me senti amparada. E o mais impressionante é que, no mesmo dia em que ele esteve lá, o meu problema foi resolvido. Gratidão eterna!",
    author: "Fernanda Marinho",
    location: "Jacarepaguá",
    featured: true,
  },
  {
    quote:
      "Muito obrigada por ter me ajudado, que continuem sendo esse canal de apoio aos menos favorecidos que assim como eu, muitas vezes precisam e não tem a quem recorrer.",
    author: "Suelen A.",
    location: "Itaboraí",
  },
  {
    quote:
      "Gostaria de externar a minha gratidão pelo respeito, prestatividade e comprometimento de toda equipe do Librelon que tive a honra de conhecer. Muito obrigado a todos.",
    author: "Robson S.",
    location: "Campo Grande",
  },
  {
    quote:
      "Deu tudo certo graças a Deus, muito obrigada ao Librelon e toda sua equipe, se não fosse vocês eu não tinha conseguido. Indicarei vocês a todos os amigos que estão passando pelo que passei.",
    author: "Vanessa O.",
    location: "Jacaré",
  },
];

export default function LandingIndex() {
  const chatRef = useRef<ChatWidgetHandle>(null);

  return (
    <div id="topo" className="min-h-screen bg-[#f4f7fb] text-[#0f1b33]">
      <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-[#f89d20]/90 bg-[#163b78]">
        <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
          {/* Linha principal: logo + ícones sociais (desktop) + botão CTA */}
          <div className="flex items-center justify-between gap-3">
            <a href="#topo" className="shrink-0">
              <LogoMark />
            </a>

            <div className="flex items-center gap-3">
              {/* Ícones sociais — visíveis inline apenas em sm+ */}
              <div className="hidden sm:flex items-center gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-[#f89d20] hover:text-[#ffc264]"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  );
                })}
              </div>
              <a
                href="#contato"
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f89d20] px-3 py-1.5 text-xs font-bold text-[#0f1b33] shadow-[0_12px_24px_rgba(248,157,32,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ffb549] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <PhoneIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Chama o Librelon
              </a>
            </div>
          </div>

          {/* Ícones sociais — segunda linha, visível apenas em mobile */}
          <div className="mt-2 flex items-center justify-center gap-2 sm:hidden">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-[#f89d20] hover:text-[#ffc264]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <main>
        {/* ============ HERO — PEGA A VISÃO, CONSUMIDOR! ============ */}
        <section className="relative isolate overflow-hidden bg-[#0d2d61] pt-28 text-white sm:pt-32">
          <img
            src="/images/hero-consumidor.png"
            alt="Painel institucional de defesa do consumidor"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,15,35,0.92)_0%,rgba(8,31,65,0.72)_42%,rgba(13,45,97,0.88)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_20%,rgba(248,157,32,0.18),transparent_18%),radial-gradient(circle_at_86%_74%,rgba(255,255,255,0.08),transparent_18%)]" />

          <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-end gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-24">
            <div className="hidden lg:col-span-6 lg:flex">
              <div className="glass-card max-w-sm rounded-[2rem] p-6 text-slate-100">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ffc264]">Gabinete do Librelon</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">
                  A Defesa do Consumidor precisa chegar onde o problema acontece.
                </h2>
                <div className="mt-6 space-y-4">
                  {[
                    "No bairro e na comunidade",
                    "No comércio local e na praça",
                    "No ponto de ônibus e na porta da casa de quem paga a conta",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f89d20] text-[#102040]">•</span>
                      <p className="text-sm leading-6 text-slate-200">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-8">
              <SectionEyebrow light>defesa do consumidor · rio de janeiro</SectionEyebrow>
              <h1 className="mt-6 max-w-2xl text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-6xl xl:text-7xl">
                Pega a visão,
                <br />
                <span className="text-[#ffad39]">consumidor!</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">
                <span className="font-bold text-[#ffc264]">Librelon:</span> o defensor do seu direito aqui no{" "}
                <span className="font-bold text-white">Rio de Janeiro!</span> Quando a empresa falha, o cidadão precisa
                ter voz. Quando o serviço não chega, a fiscalização precisa acontecer. Quando o direito é desrespeitado,
                alguém precisa cobrar solução!
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => chatRef.current?.openChat()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f89d20] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#102040] transition hover:-translate-y-0.5 hover:bg-[#ffb549]"
                >
                  Falar com a equipe
                </button>
                <a
                  href="#problemas"
                  className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:border-[#ffc264] hover:text-[#ffc264]"
                >
                  Já passou por isso?
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {["Ouvir sua demanda", "Entender sua dor", "Lutar pelo seu direito"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm font-medium text-slate-100 shadow-[0_14px_30px_rgba(5,18,42,0.16)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ GABINETE ITINERANTE + GRÁFICO ============ */}
        <section id="gabinete" className="relative overflow-hidden bg-[#f7faff] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:px-8">
            <div>
              <SectionEyebrow>mais perto para servir melhor!</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                O Gabinete do Librelon
                <span className="text-[#f89d20]"> veio até você!</span>
              </h2>
              <Swoosh />
              <p className="mt-7 text-lg leading-8 text-slate-600">
                A Defesa do Consumidor precisa chegar onde o problema acontece: no bairro, na comunidade, no comércio
                local, na praça, no ponto de ônibus e na porta da casa de quem paga a conta.
              </p>

              <div className="mt-9 grid gap-5">
                {gabinetePillars.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="flex items-start gap-5 rounded-[1.75rem] border border-[#dbe6f4] bg-white p-6 shadow-[0_22px_60px_rgba(27,59,117,0.08)] transition hover:-translate-y-1"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#163b78] text-white">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-[#f89d20]">{item.title}</h3>
                        <p className="mt-2 text-base leading-7 text-slate-600">{item.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-[2rem] bg-[#15376f] p-8 text-white shadow-[0_28px_70px_rgba(10,31,65,0.28)] sm:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#ffc264]">Consumidor, você não está sozinho!</p>
                <h3 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
                  <span className="text-[#ffad39]">+ de 4 mil</span>
                  <br />
                  consumidores orientados no Rio
                </h3>
                <p className="mt-3 inline-block rounded bg-[#f89d20] px-3 py-1 text-sm font-black uppercase tracking-[0.14em] text-[#102040]">
                  em menos de um ano!
                </p>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                  Principais categorias de consumo:
                </p>
                <div className="mt-5 space-y-5">
                  {categories.map((cat) => (
                    <div key={cat.label}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                          <p className="text-base font-semibold text-white">{cat.label}</p>
                        </div>
                        <p className="text-lg font-black text-white">{cat.value.toLocaleString("pt-BR")}%</p>
                      </div>
                      <div className="mt-2 h-4 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(cat.value / 45) * 100}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#dce6f4] bg-white p-8 shadow-[0_24px_70px_rgba(27,59,117,0.1)]">
                <p className="text-2xl font-black uppercase tracking-tight text-[#163b78]">
                  Vai comprar? Melhor pesquisar.
                  <br />
                  Na dúvida, <span className="rounded bg-[#f89d20] px-2 text-[#102040]">chama o Librelon!</span>
                </p>
                <button
                  onClick={() => chatRef.current?.openChat()}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#163b78] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#1f4b96]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Falar com a equipe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============ QUEM É LIBRELON — VOZ FIRME ============ */}
        <section id="quem-somos" className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="absolute inset-y-0 left-0 hidden w-1/3 bg-[radial-gradient(circle_at_left,rgba(22,59,120,0.06),transparent_60%)] lg:block" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <SectionEyebrow>librelon</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Uma voz firme na defesa
                <span className="text-[#f89d20]"> do consumidor no Rio!</span>
              </h2>
              <Swoosh />
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">
                Librelon tem atuação reconhecida na pauta da Defesa do Consumidor. Presidiu a Comissão de Defesa do
                Consumidor da UNALE na gestão 2022/2023, experiência que ampliou sua vivência nacional sobre os problemas
                que atingem consumidores em diferentes estados. Membro Efetivo da Comissão de Defesa do Consumidor na
                ALERJ, exerce seu 2º mandato como deputado estadual.
              </p>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Acredita que o <strong className="text-[#163b78]">SERVIDOR</strong> deve servir a{" "}
                <strong className="text-[#163b78]">DOR</strong> do povo e, como parlamentar, conhece de perto a dor do
                descaso que inúmeros consumidores carregam. Por isso, Librelon levou essa pauta para a comunicação
                popular por meio da TV aberta, para orientar os consumidores, dar visibilidade a denúncias e acompanhar
                casos reais de pessoas que enfrentam contratos, cobranças e serviços mal prestados.
              </p>
              <div className="mt-8 rounded-[1.6rem] bg-[#163b78] p-6 text-white">
                <p className="text-xl font-black uppercase leading-snug tracking-tight sm:text-2xl">
                  Na lei, na TV e na rua, a{" "}
                  <span className="rounded bg-[#f89d20] px-2 text-[#102040]">defesa do consumidor</span> tem que estar
                  perto de quem mais precisa.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#dce6f4] bg-[linear-gradient(180deg,#f9fbff_0%,#eff5fd_100%)] p-8 shadow-[0_24px_80px_rgba(27,59,117,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-[#163b78]">"Defender o consumidor é defender quem luta"</h3>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#163b78] text-white">
                  <QuoteIcon className="h-7 w-7" />
                </div>
              </div>
              <blockquote className="mt-6 space-y-4 text-base italic leading-8 text-slate-700">
                <p>
                  "Defender o consumidor é defender quem luta para pagar suas contas em dia, acorda cedo, enfrenta
                  condução cheia, trabalha honestamente pra sustentar a casa.{" "}
                  <span className="bg-[#f89d20]/90 px-1 font-bold not-italic text-[#102040]">
                    O cidadão de bem não pode ser tratado como mais um número de protocolo.
                  </span>
                </p>
                <p>
                  Não dá pra tolerar descaso com o trabalhador! Se existe direito, ele precisa ser garantido e
                  respeitado."
                </p>
              </blockquote>
              <div className="mt-6 border-t border-[#dce6f4] pt-5">
                <p className="inline-block rounded bg-[#f89d20] px-3 py-1 text-base font-black text-[#102040]">Danniel Librelon</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">Dep. Estadual (RJ)</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ E VOCÊ, JÁ PASSOU POR ISSO? ============ */}
        <section id="problemas" className="pattern-mesh relative overflow-hidden bg-[#12366d] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow light>o problema × a dor real</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
                E você, já passou
                <span className="text-[#ffad39]"> por isso?</span>
              </h2>
              <Swoosh />
              <p className="mt-7 text-lg leading-8 text-blue-100">
                Não importa se você é morador da baixada, capital ou do interior do Rio. Se você é consumidor, saiba que
                alguém luta por você! Librelon entende que o consumidor não pode ser invisível.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {problems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group flex flex-col rounded-[2rem] border border-white/10 bg-white/8 shadow-[0_20px_60px_rgba(3,11,29,0.28)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#f89d20]/50 hover:bg-white/10"
                  >
                    <div className="border-b border-white/10 p-7 pb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f89d20] text-[#102040] transition group-hover:scale-105">
                        <Icon className="h-7 w-7" />
                      </div>
                      <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#ffc264]">O problema</p>
                      <h3 className="mt-2 text-xl font-black leading-tight tracking-tight text-white">{item.title}</h3>
                    </div>
                    <div className="p-7 pt-5">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#ffc264]">A dor real do consumidor</p>
                      <p className="mt-3 text-base leading-7 text-blue-100">{item.pain}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ REGISTRE, GUARDE E COBRE ============ */}
        <section id="orientacoes" className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow>antes de desistir, faça o básico</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Registre, guarde
                <span className="text-[#f89d20]"> e cobre!</span>
              </h2>
              <Swoosh />
              <p className="mt-7 text-lg leading-8 text-slate-600">
                Quando um problema acontecer, não fique apenas na conversa informal. Esses documentos ajudam o consumidor
                a provar o que aconteceu e buscar seus direitos.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {basicSteps.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.75rem] border border-[#dbe6f4] bg-[#f9fbff] p-7 shadow-[0_22px_60px_rgba(27,59,117,0.08)] transition hover:-translate-y-1"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f89d20] text-lg font-black text-[#102040]">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-tight text-[#163b78]">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#163b78] p-8 text-white sm:flex-row sm:items-center">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f89d20] text-[#102040]">
                  <ShieldIcon className="h-7 w-7" />
                </div>
                <p className="max-w-xl text-xl font-bold leading-8">
                  Quando a empresa falha, o cidadão precisa ter voz. Quando o direito é desrespeitado, alguém precisa
                  cobrar solução!
                </p>
              </div>
              <button
                onClick={() => chatRef.current?.openChat()}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#f89d20] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-[#102040] transition hover:-translate-y-0.5 hover:bg-[#ffb549]"
              >
                Registrar demanda
              </button>
            </div>
          </div>
        </section>

        {/* ============ DEPOIMENTOS ============ */}
        <section id="depoimentos" className="pattern-soft relative overflow-hidden bg-[#eef4fb] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <SectionEyebrow>quando a dor encontra um defensor!</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Centenas de demandas
                <span className="text-[#f89d20]"> recebidas semanalmente!</span>
              </h2>
              <div className="flex justify-center">
                <Swoosh />
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <article className="rounded-[2rem] bg-[#15376f] p-8 text-white shadow-[0_24px_70px_rgba(10,31,65,0.28)] lg:row-span-2">
                <QuoteIcon className="h-10 w-10 text-[#f89d20]" />
                <p className="mt-5 text-base italic leading-8 text-blue-100">"{testimonials[0].quote}"</p>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-lg font-black text-white">{testimonials[0].author}</p>
                  <p className="text-sm font-semibold text-[#ffc264]">{testimonials[0].location}</p>
                </div>
              </article>

              {testimonials.slice(1).map((item) => (
                <article
                  key={item.author}
                  className="rounded-[2rem] border border-[#dce6f4] bg-white p-8 shadow-[0_24px_70px_rgba(27,59,117,0.12)] transition hover:-translate-y-1"
                >
                  <QuoteIcon className="h-9 w-9 text-[#f89d20]" />
                  <p className="mt-4 text-base italic leading-8 text-slate-600">"{item.quote}"</p>
                  <div className="mt-6 border-t border-[#e4ecf7] pt-5">
                    <p className="text-lg font-black text-[#163b78]">{item.author}</p>
                    <p className="text-sm font-semibold text-[#2c69b1]">{item.location}</p>
                  </div>
                </article>
              ))}

              <article className="flex flex-col items-start justify-center rounded-[2rem] border-2 border-dashed border-[#f89d20]/60 bg-white/60 p-8">
                <p className="text-2xl font-black uppercase leading-tight tracking-tight text-[#163b78]">
                  Você também passou por algo parecido?
                </p>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Registre sua demanda e faça parte de quem já encontrou um defensor.
                </p>
                <button
                  onClick={() => chatRef.current?.openChat()}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f89d20] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[#102040] transition hover:-translate-y-0.5 hover:bg-[#ffb549]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Falar com a equipe
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* ============ CONTATO ============ */}
        <section id="contato" className="relative overflow-hidden bg-[#103063] py-20 text-white sm:py-24">
          <img
            src="/images/hero-consumidor.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,26,56,0.9),rgba(6,18,40,0.94))]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <SectionEyebrow light>mais perto para servir melhor!</SectionEyebrow>
              <h2 className="mt-5 max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
                Para ouvir, entender
                <span className="text-[#ffad39]"> e lutar pelo seu direito!</span>
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100">
                Não importa se você é morador da baixada, capital ou do interior do Rio. Se você é consumidor, saiba
                que alguém luta por você! Fale com o gabinete pelos canais oficiais.
              </p>

              <div className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 text-left">
                {[
                  { title: "Instagram", value: "@danniellibrelonrj", icon: InstagramIcon },
                  { title: "Facebook", value: "Danniel Librelon", icon: FacebookIcon },
                  { title: "WhatsApp", value: "(21) 99566-1781", icon: WhatsAppIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f89d20] text-[#102040]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-[#ffc264]">{item.title}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-blue-100 sm:flex-row sm:items-center sm:justify-between">
              <LogoMark />
              <p>© {new Date().getFullYear()} Danniel Librelon · Deputado Estadual · Página de Defesa do Consumidor.</p>
            </div>
          </div>
        </section>
      </main>

      <ChatWidget ref={chatRef} />
    </div>
  );
}
