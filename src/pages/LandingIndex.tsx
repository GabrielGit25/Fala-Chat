import { useRef, useState } from 'react';
import ChatWidget, { type ChatWidgetHandle } from '../components/ChatWidget';

type IconProps = { className?: string };

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 24 24" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <p className="text-xl tracking-tight text-white sm:text-2xl">
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
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.28em] ${light ? 'border-white/15 bg-white/10 text-slate-100' : 'border-[#d8e2f2] bg-white text-[#24508f]'}`}>
      <span className={`h-2 w-2 rounded-full ${light ? 'bg-[#f89d20]' : 'bg-[#2c69b1]'}`} />
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

function ShieldIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function BalanceIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 4v15" />
      <path d="M7 7h10" />
      <path d="M5 20h14" />
      <path d="M7 7l-3 5h6l-3-5z" />
      <path d="M17 7l-3 5h6l-3-5z" />
    </svg>
  );
}

function ReceiptIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 3h10v18l-2-1.5L12 21l-3-1.5L7 21V3z" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12h5" />
      <path d="M9.5 16h3" />
    </svg>
  );
}

function PhoneIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M21 16.5v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h2a2 2 0 0 1 2 1.7l.4 2.7a2 2 0 0 1-.6 1.8l-1.4 1.4a16 16 0 0 0 5.7 5.7l1.4-1.4a2 2 0 0 1 1.8-.6l2.7.4A2 2 0 0 1 21 16.5z" />
    </svg>
  );
}

function MailIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function MegaphoneIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M10 8l7-3v14l-7-3" />
      <path d="M14 10.5a3.5 3.5 0 0 1 0 3" />
    </svg>
  );
}

function WifiIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M2 8.8A15.6 15.6 0 0 1 12 5c4 0 7.7 1.5 10 3.8" />
      <path d="M5 12.5A10.8 10.8 0 0 1 12 10c2.7 0 5.2 1 7 2.6" />
      <path d="M8.4 16.2A5.7 5.7 0 0 1 12 15c1.4 0 2.7.4 3.7 1.2" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CartIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.7L21 7H7.3" />
    </svg>
  );
}

function SearchIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

function PlayIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.8l5.5 3.2L10 15.2V8.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function InstagramIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 20a8 8 0 1 0-4.3-1.3L5 21l2.5-2A8 8 0 0 0 12 20z" />
      <path d="M9.5 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.4 1c.2.4 0 .6-.1.8l-.4.5c-.1.1-.2.3 0 .6a5.8 5.8 0 0 0 2.7 2.5c.3.2.5.1.7 0l.6-.7c.2-.2.4-.2.8-.1l1 .5c.4.2.4.3.4.6v.5c0 .3-.1.5-.5.7-.4.2-.9.4-1.5.3-1.4-.2-3-.9-4.5-2.3-1.4-1.4-2.1-2.8-2.3-4.2-.1-.6.1-1.2.4-1.7z" />
    </svg>
  );
}

function ArrowUpIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  );
}

const navLinks = [
  { label: 'Quem somos?', href: '#quem-somos' },
  { label: 'Nossas bandeiras', href: '#bandeiras' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Defesa do Consumidor', href: '#direitos' },
  { label: 'Contato', href: '#contato' },
  { label: 'FAQ', href: '#faq' },
];

const socialLinks = [
  { label: 'Instagram', href: '#contato', icon: InstagramIcon },
  { label: 'WhatsApp', href: '#contato', icon: WhatsAppIcon },
  { label: 'Podcast', href: '#midia', icon: PlayIcon },
  { label: 'E-mail', href: '#contato', icon: MailIcon },
];

const priorities = [
  { title: 'Cobranças indevidas', description: 'Apoio para contestar faturas abusivas, juros desproporcionais, duplicidade de cobrança e negativação irregular.', icon: ReceiptIcon },
  { title: 'Golpes e fraudes digitais', description: 'Orientação para compras online, golpes em PIX, clonagem de contas, marketplaces e segurança de dados do consumidor.', icon: ShieldIcon },
  { title: 'Serviços essenciais', description: 'Intervenção em casos que envolvem energia, água, telefonia, internet e serviços que afetam a rotina da população.', icon: WifiIcon },
  { title: 'Superendividamento', description: 'Mediação responsável para renegociação de dívidas e reorganização financeira com base no Código de Defesa do Consumidor.', icon: BalanceIcon },
];

const metrics = [
  { value: '+12 mil', label: 'consumidores orientados', note: 'atendimento humanizado e escuta qualificada' },
  { value: '+480', label: 'mediações concluídas', note: 'casos com encaminhamento para solução' },
  { value: '92%', label: 'triagem em até 48h', note: 'prioridade para demandas urgentes' },
];

const actions = [
  { step: '01', title: 'Escuta e triagem do caso', description: 'Recebemos a demanda, verificamos documentos, identificamos o direito envolvido e definimos o melhor encaminhamento.' },
  { step: '02', title: 'Mediação com fornecedores', description: 'Abrimos diálogo com empresas e prestadores de serviço para buscar correção rápida, transparente e registrada.' },
  { step: '03', title: 'Encaminhamento técnico', description: 'Quando necessário, direcionamos o consumidor a órgãos parceiros, audiências, defesa administrativa e fiscalização.' },
  { step: '04', title: 'Educação para prevenir novos abusos', description: 'Produzimos conteúdos, cartilhas e alertas para reduzir golpes, desinformação e prejuízos recorrentes.' },
];

const news = [
  { category: 'Atendimento', title: 'Mutirão ajuda famílias a revisar dívidas e contratos abusivos', description: 'Ação especial com foco em renegociação, transparência bancária e proteção contra superendividamento.', accent: 'from-[#4f89d9] via-[#275596] to-[#173a73]', icon: BalanceIcon },
  { category: 'Fiscalização', title: 'Operação orienta consumidores sobre entrega, prazo e garantia no comércio eletrônico', description: 'Campanha educativa reforça direitos de arrependimento, rastreio e devolução em compras online.', accent: 'from-[#1d5e99] via-[#15426f] to-[#0c234b]', icon: CartIcon },
  { category: 'Conectividade', title: 'Canal recebe denúncias de falha de internet, telefonia e serviços interrompidos', description: 'Equipe faz triagem de casos repetidos e cobra resposta mais rápida das concessionárias e operadoras.', accent: 'from-[#f8a736] via-[#e38416] to-[#8d4d09]', icon: MegaphoneIcon },
];

const faqItems = [
  { question: 'Quando devo procurar o canal de defesa do consumidor?', answer: 'Sempre que houver cobrança indevida, publicidade enganosa, negativa de atendimento, descumprimento de oferta, falha em serviços essenciais, golpes digitais ou dificuldade para cancelar contratos e assinaturas.' },
  { question: 'Quais documentos ajudam no atendimento?', answer: 'Comprovantes de pagamento, prints de conversas, faturas, e-mails, número do protocolo, nota fiscal, contrato e qualquer registro que mostre a relação com o fornecedor e o problema relatado.' },
  { question: 'A orientação substitui processo judicial?', answer: 'Nem sempre. Muitos casos são resolvidos por mediação e cobrança administrativa. Quando for preciso avançar, o consumidor recebe encaminhamento técnico para os órgãos adequados.' },
  { question: 'Compras online têm proteção específica?', answer: 'Sim. O consumidor tem direito à informação clara, entrega no prazo, suporte, garantia e, em muitos casos, ao arrependimento em até 7 dias nas compras realizadas fora do estabelecimento comercial.' },
];

export default function LandingIndex() {
  const chatRef = useRef<ChatWidgetHandle>(null);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div id="topo" className="min-h-screen bg-[#f4f7fb] text-[#0f1b33]">
      <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-[#f89d20]/90 bg-[#163b78]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 sm:gap-6 px-2 py-3 sm:px-6 sm:py-4 lg:px-8">
          <a href="#topo" className="shrink-0">
            <LogoMark />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-[1.04rem] font-semibold text-white transition hover:text-[#ffc264]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 md:flex">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} aria-label={item.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-[#f89d20] hover:text-[#ffc264]">
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
            <a href="#contato" className="inline-flex items-center gap-1.5 rounded-full bg-[#f89d20] px-3 py-1.5 text-[0.7rem] font-bold text-[#0f1b33] shadow-[0_12px_24px_rgba(248,157,32,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ffb549] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Atendimento
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#0d2d61] pt-28 text-white sm:pt-32">
          <img
            src="/images/hero-consumidor.png"
            alt="Painel institucional de defesa do consumidor"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[rgba(4,15,35,0.92)] via-[rgba(8,31,65,0.72)] to-[rgba(13,45,97,0.88)]" />
          <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(circle at 78% 20%, rgba(248,157,32,0.18), transparent 18%), radial-gradient(circle at 86% 74%, rgba(255,255,255,0.08), transparent 18%)' }} />

          <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-end gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-24">
            <div className="hidden lg:col-span-6 lg:flex">
              <div className="glass-card max-w-sm rounded-[2rem] p-6 text-slate-100">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ffc264]">Plantão do consumidor</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">Direitos defendidos com presença, escuta e encaminhamento.</h2>
                <div className="mt-6 space-y-4">
                  {['Cobranças indevidas e negativação irregular', 'Compras online, golpes digitais e cancelamentos', 'Energia, água, telefonia, internet e transporte'].map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f89d20] text-[#102040]">•</span>
                      <p className="text-sm leading-6 text-slate-200">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-8">
              <SectionEyebrow light>defesa do consumidor · atendimento cidadão</SectionEyebrow>
              <h1 className="mt-6 max-w-2xl text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-6xl xl:text-7xl">
                <span className="text-[#ffad39]">Seus direitos</span>
                <br />
                merecem voz,
                <br />
                resposta e ação.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">
                Uma página inspirada no visual institucional da referência, agora dedicada à orientação de consumidores,
                mediação de conflitos e proteção contra abusos em serviços, contratos e compras presenciais ou digitais.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => chatRef.current?.openChat()} className="inline-flex items-center justify-center rounded-full bg-[#f89d20] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#102040] transition hover:-translate-y-0.5 hover:bg-[#ffb549]">
                  Falar com a equipe
                </button>
                <a href="#direitos" className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/8 px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:border-[#ffc264] hover:text-[#ffc264]">
                  Conhecer os direitos
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {['Atendimento por canal direto', 'Encaminhamento técnico', 'Conteúdo prático e preventivo'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm font-medium text-slate-100 shadow-[0_14px_30px_rgba(5,18,42,0.16)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pattern-rings relative overflow-hidden bg-[#226ea9] text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-20">
            {metrics.map((item) => (
              <div key={item.label} className="relative text-center lg:text-left">
                <p className="text-6xl font-black leading-none text-[#ffad39] sm:text-7xl">{item.value}</p>
                <h3 className="mt-4 text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-4xl">{item.label}</h3>
                <p className="mt-4 text-base leading-7 text-blue-100">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="quem-somos" className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="absolute inset-y-0 left-0 hidden w-1/3 lg:block" style={{ background: 'radial-gradient(circle at left, rgba(22,59,120,0.06), transparent 60%)' }} />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <SectionEyebrow>quem somos</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Defesa do consumidor
                <span className="text-[#f89d20]"> com linguagem clara</span>
              </h2>
              <Swoosh />
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">
                Esta página reúne um modelo de comunicação pública para orientar cidadãos sobre direitos básicos,
                prevenção de abusos e caminhos de solução. O foco é transformar informação jurídica em conteúdo útil,
                acessível e com aparência institucional forte.
              </p>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                A estética segue a referência: navegação sólida, grandes chamadas tipográficas, azul profundo, laranja de
                destaque, blocos de números e seções que passam credibilidade, presença e capacidade de resposta.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#dce6f4] bg-gradient-to-b from-[#f9fbff] to-[#eff5fd] p-8 shadow-[0_24px_80px_rgba(27,59,117,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#2c69b1]">Compromisso público</p>
                  <h3 className="mt-2 text-2xl font-black text-[#163b78]">Atendimento que informa e encaminha</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#163b78] text-white">
                  <ShieldIcon className="h-7 w-7" />
                </div>
              </div>
              <div className="mt-8 space-y-5">
                {['Explicar o que o fornecedor pode ou não fazer.', 'Mostrar documentos que fortalecem a reclamação.', 'Apoiar o consumidor antes que o problema vire prejuízo maior.', 'Divulgar alertas sobre golpes e práticas abusivas recorrentes.'].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-4">
                    <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f89d20] text-sm font-black text-[#0f1b33]">✓</span>
                    <p className="text-base leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="bandeiras" className="pattern-mesh relative overflow-hidden bg-[#12366d] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow light>nossas bandeiras</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
                Prioridades da defesa
                <span className="text-[#ffad39]"> do consumidor</span>
              </h2>
              <Swoosh />
              <p className="mt-7 text-lg leading-8 text-blue-100">
                Uma atuação moderna precisa responder aos problemas mais recorrentes da população: contas erradas,
                fraudes digitais, serviços interrompidos e contratos que colocam famílias em situação de vulnerabilidade.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {priorities.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="group rounded-[2rem] border border-white/10 bg-white/8 p-7 shadow-[0_20px_60px_rgba(3,11,29,0.28)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#f89d20]/50 hover:bg-white/10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f89d20] text-[#102040] transition group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black tracking-tight text-white">{item.title}</h3>
                    <p className="mt-4 text-base leading-7 text-blue-100">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="atuacao" className="relative overflow-hidden bg-[#f7faff] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div>
              <SectionEyebrow>como atuamos</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Da denúncia à
                <span className="text-[#f89d20]"> solução possível</span>
              </h2>
              <Swoosh />
              <p className="mt-7 text-lg leading-8 text-slate-600">
                O objetivo é reduzir a distância entre o problema e a resposta. Cada demanda recebe leitura técnica,
                linguagem simples e orientação prática para que o cidadão entenda seus próximos passos.
              </p>

              <div className="mt-10 rounded-[2rem] border border-[#dce6f4] bg-white p-8 shadow-[0_24px_70px_rgba(27,59,117,0.1)]">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#2c69b1]">Canal prioritário</p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-[#163b78]">Orientação rápida para casos urgentes</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Quando o caso envolve bloqueio de serviço essencial, fraude recente, negativação inesperada ou risco de
                  perda financeira, a triagem precisa ser imediata e objetiva.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Golpe digital', 'Cobrança abusiva', 'Interrupção de serviço', 'Compra não entregue'].map((tag) => (
                    <span key={tag} className="rounded-full border border-[#d7e3f5] bg-[#f5f9ff] px-4 py-2 text-sm font-semibold text-[#24508f]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              {actions.map((item) => (
                <article key={item.step} className="rounded-[1.75rem] border border-[#dbe6f4] bg-white p-6 shadow-[0_22px_60px_rgba(27,59,117,0.08)] transition hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#163b78] text-lg font-black text-white">{item.step}</div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-[#163b78]">{item.title}</h3>
                      <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="direitos" className="relative overflow-hidden bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <SectionEyebrow>defesa do consumidor</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Direitos que precisam estar
                <span className="text-[#f89d20]"> ao alcance de todos</span>
              </h2>
              <Swoosh />
              <div className="mt-8 grid gap-4">
                {[
                  { title: 'Oferta deve ser cumprida', text: 'Preço, prazo, condição e benefício anunciados precisam ser respeitados pelo fornecedor.' },
                  { title: 'Informação clara e acessível', text: 'Contrato, cobrança, política de cancelamento e garantia não podem ser escondidos em letras miúdas.' },
                  { title: 'Serviço essencial exige resposta rápida', text: 'Interrupções indevidas de água, energia, internet e telefonia precisam de correção e justificativa.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.6rem] border border-[#dce6f4] bg-[#f9fbff] p-6">
                    <h3 className="text-xl font-black text-[#163b78]">{item.title}</h3>
                    <p className="mt-2 text-base leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="faq" className="rounded-[2rem] bg-[#15376f] p-7 text-white shadow-[0_28px_70px_rgba(10,31,65,0.28)] sm:p-8 lg:p-10">
              <SectionEyebrow light>perguntas frequentes</SectionEyebrow>
              <h3 className="mt-5 text-3xl font-black uppercase tracking-tight sm:text-4xl">Tire dúvidas antes que o problema aumente</h3>
              <div className="mt-8 space-y-3">
                {faqItems.map((item, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={item.question} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/8">
                      <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left">
                        <span className="text-base font-bold leading-7 text-white sm:text-lg">{item.question}</span>
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-[#ffc264] transition ${isOpen ? 'rotate-45' : 'rotate-0'}`}>+</span>
                      </button>
                      {isOpen && <p className="px-5 pb-5 text-base leading-7 text-blue-100">{item.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="midia" className="pattern-soft relative overflow-hidden bg-[#eef4fb] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <SectionEyebrow>na mídia</SectionEyebrow>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-[#163b78] sm:text-5xl">
                Casos, alertas e
                <span className="text-[#f89d20]"> campanhas públicas</span>
              </h2>
              <div className="flex justify-center"><Swoosh /></div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {news.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="overflow-hidden rounded-[2rem] border border-[#dce6f4] bg-white shadow-[0_24px_70px_rgba(27,59,117,0.12)] transition hover:-translate-y-1">
                    <div className={`relative h-56 bg-gradient-to-br ${item.accent} p-7 text-white`}>
                      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.24), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.08), transparent 45%)' }} />
                      <div className="relative flex h-full flex-col justify-between">
                        <div className="inline-flex w-fit items-center rounded-full bg-white/14 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.26em] text-white">{item.category}</div>
                        <div className="flex items-end justify-between gap-4">
                          <div className="max-w-[14rem] text-sm leading-6 text-white/90">Informação pública para proteger escolhas, contratos e serviços.</div>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14 text-white backdrop-blur-sm"><Icon className="h-7 w-7" /></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="text-2xl font-black tracking-tight text-[#163b78]">{item.title}</h3>
                      <p className="mt-4 text-base leading-7 text-slate-600">{item.description}</p>
                      <a href="#contato" className="mt-6 inline-flex text-sm font-black uppercase tracking-[0.18em] text-[#2c69b1] transition hover:text-[#f89d20]">Saiba mais</a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contato" className="relative overflow-hidden bg-[#103063] py-20 text-white sm:py-24">
          <img src="/images/hero-consumidor.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,26,56,0.9)] to-[rgba(6,18,40,0.94)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <SectionEyebrow light>contato</SectionEyebrow>
                <h2 className="mt-5 max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
                  Canal direto para
                  <span className="text-[#ffad39]"> orientar e encaminhar</span>
                </h2>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100">
                  Use esta estrutura como página institucional para um mandato, frente parlamentar, escritório público ou
                  iniciativa de defesa cidadã focada em consumo, transparência e proteção contra abusos.
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { title: 'Gabinete do povo', value: '(21) 99868-0101', icon: PhoneIcon },
                    { title: 'Zap do consumidor', value: '(21) 99566-1781', icon: WhatsAppIcon },
                    { title: 'E-mail de atendimento', value: 'atendimento@danniellibrelon.com.br', icon: MailIcon },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f89d20] text-[#102040]"><Icon className="h-5 w-5" /></div>
                        <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-[#ffc264]">{item.title}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-[0_28px_70px_rgba(1,10,24,0.35)] backdrop-blur-sm sm:p-8">
                <h3 className="text-2xl font-black tracking-tight text-white">Encontre orientação</h3>
                <p className="mt-3 text-base leading-7 text-blue-100">Pesquise temas frequentes ou use a página como base para um canal de atendimento especializado.</p>
                <div className="mt-6 flex items-center rounded-full bg-white px-4 py-3 text-slate-500 shadow-inner">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                  <input type="text" placeholder="Digite o que procura..." className="w-full bg-transparent px-3 text-base text-slate-700 outline-none placeholder:text-slate-400" />
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ffc264]">Siga os canais</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a key={item.label} href={item.href} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-0.5 hover:border-[#f89d20] hover:text-[#ffc264]" aria-label={item.label}>
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-sm leading-7 text-blue-100">Política de privacidade · Canal demonstrativo · Conteúdo institucional sobre defesa do consumidor.</p>
                </div>
              </div>
            </div>

            <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-blue-100 sm:flex-row sm:items-center sm:justify-between">
              <LogoMark />
              <p>&copy; {new Date().getFullYear()} Danniel Librelon · Deputado Estadual · Página de Defesa do Consumidor.</p>
            </div>
          </div>
        </section>
      </main>

      <ChatWidget ref={chatRef} />
    </div>
  );
}
