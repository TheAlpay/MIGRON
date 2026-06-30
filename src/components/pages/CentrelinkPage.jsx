import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield, AlertTriangle, CheckCircle2, XCircle, Minus,
    ChevronDown, ChevronUp, ExternalLink, ArrowLeft,
    Clock, DollarSign, FileText, Users, Home,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const visaRows = [
    {
        visa: 'Australian Citizen',
        right: 'Full access — no waiting period',
        status: 'yes',
        note: 'All payments available from day one.',
    },
    {
        visa: 'Permanent Resident (189 / 190 / 191 / 186)',
        right: 'Full access — subject to NARWP',
        status: 'partial',
        note: '4-year Newly Arrived Resident\'s Waiting Period (NARWP) for most payments. Child Care Subsidy and Medicare are exempt.',
    },
    {
        visa: 'Skilled Regional PR (491 → PR pathway)',
        right: 'Full access — subject to NARWP',
        status: 'partial',
        note: 'Same rules as other PR holders once permanent visa is granted.',
    },
    {
        visa: 'Temporary Skill Shortage (482)',
        right: 'Generally not eligible',
        status: 'no',
        note: 'Rare exceptions may apply for compelling humanitarian circumstances. Seek advice from Services Australia.',
    },
    {
        visa: 'Partner Visa (820 / 801, 309 / 100)',
        right: 'Limited — waiting period applies',
        status: 'partial',
        note: 'Temporary partner visa (820/309) holders have very limited access. NARWP begins from grant of permanent partner visa (801/100).',
    },
    {
        visa: 'Bridging Visa A / B / C',
        right: 'Varies — mirrors underlying visa',
        status: 'partial',
        note: 'Access depends on the substantive visa that was held. Generally limited or nil while on a bridging visa.',
    },
    {
        visa: 'Student Visa (500)',
        right: 'Not eligible',
        status: 'no',
        note: 'No Centrelink access at all. Medicare may be available via bilateral health agreement depending on country of origin.',
    },
    {
        visa: 'Working Holiday (417 / 462)',
        right: 'Not eligible',
        status: 'no',
        note: 'No access to any Centrelink payments.',
    },
    {
        visa: 'Graduate Temporary (485)',
        right: 'Not eligible',
        status: 'no',
        note: 'Temporary visa — no access to welfare payments.',
    },
    {
        visa: 'Visitor Visa (600)',
        right: 'Not eligible',
        status: 'no',
        note: 'Tourists and short-stay visitors have zero access.',
    },
];

const payments = [
    {
        icon: DollarSign,
        name: 'JobSeeker Payment',
        amount: 'Up to $693.10 / fortnight (single, no children)',
        narwp: '4 years (NARWP)',
        color: '#ccff00',
        who: 'Unemployed Australians and permanent residents who are actively seeking work. Must meet mutual obligation requirements (job applications, Skills for Education and Employment, etc.).',
        howTo: 'Claim via myGov → Services Australia. You will need to attend an initial appointment and set up fortnightly income reporting.',
        note: 'Rate is indexed twice yearly (March and September). Supplement payments may increase the total amount.',
    },
    {
        icon: Users,
        name: 'Youth Allowance',
        amount: 'Up to $572.80 / fortnight',
        narwp: '4 years (NARWP)',
        color: '#ccff00',
        who: 'Australian citizens and PR holders aged 16–24 who are studying full-time, undertaking an apprenticeship, or are unemployed and looking for work.',
        howTo: 'Claim via myGov. Parental income is tested for students under 22 unless they are considered independent.',
        note: 'Rates vary by living arrangements and independence status.',
    },
    {
        icon: Users,
        name: 'Family Tax Benefit (Part A & B)',
        amount: 'Part A: up to $222.04 / fortnight per child. Part B: up to $181.82 / fortnight',
        narwp: '1 year (NARWP)',
        color: '#ccff00',
        who: 'Families responsible for children under 16 (or under 19 if in full-time study). Part B is for single-parent families or families where one parent earns significantly more.',
        howTo: 'Claim through myGov. Settled via tax return at end of financial year — ensure you lodge a tax return every year to avoid overpayment debt.',
        note: 'FTB Part A is income-tested on family income. FTB Part B is income-tested on the secondary earner\'s income.',
    },
    {
        icon: Shield,
        name: 'Child Care Subsidy (CCS)',
        amount: 'Up to 90% of approved childcare fees',
        narwp: 'No waiting period',
        color: '#00ff88',
        who: 'Families using approved childcare (long day care, family day care, outside school hours care). PR holders qualify immediately — no NARWP applies.',
        howTo: 'Claim via myGov. The subsidy is paid directly to the childcare provider who then charges you the reduced gap amount.',
        note: 'Income tested. Subsidy percentage ranges from 90% (lower incomes) down to a minimum of 0% for higher incomes. Hours of subsidised care depend on activity level (work, study, volunteering).',
    },
    {
        icon: Home,
        name: 'Parenting Payment',
        amount: 'Single: up to $980.50 / fortnight. Partnered: up to $604.50 / fortnight',
        narwp: '2 years (NARWP)',
        color: '#ccff00',
        who: 'Primary carers of young children — single parents with a child under 14, partnered parents with a child under 6.',
        howTo: 'Claim via myGov. Must be the principal carer and meet residency requirements.',
        note: 'Income and assets tested. Partnered rate is substantially lower. Mutual obligation requirements apply once youngest child reaches certain ages.',
    },
    {
        icon: Shield,
        name: 'Disability Support Pension (DSP)',
        amount: 'Up to $1,144.40 / fortnight (single)',
        narwp: '10 years continuous residence',
        color: '#ccff00',
        who: 'People with a permanent physical, intellectual, or psychiatric condition that prevents them from working 15+ hours per week at minimum wage.',
        howTo: 'Requires a Job Capacity Assessment (JCA) and may require a Disability Medical Assessment (DMA). Claim via myGov or at a service centre.',
        note: 'Strict medical eligibility criteria — most applicants require specialist medical evidence. 10-year qualifying residence applies (some humanitarian visa holders are exempt).',
    },
    {
        icon: DollarSign,
        name: 'Age Pension',
        amount: 'Up to $1,096.70 / fortnight (single)',
        narwp: '10-year qualifying residence',
        color: '#ccff00',
        who: 'Australian citizens and PR holders who have reached pension age (67 years) and meet residence and income/assets tests.',
        howTo: 'Claim via myGov or at a Services Australia service centre up to 13 weeks before reaching pension age.',
        note: 'You must have lived in Australia for at least 10 years total (with at least 5 years continuous). Some international social security agreements may reduce this requirement.',
    },
    {
        icon: Home,
        name: 'Rent Assistance',
        amount: 'Up to $211.20 / fortnight (single, no children)',
        narwp: 'Same as the primary payment it supplements',
        color: '#ccff00',
        who: 'Added automatically to eligible welfare payments for people paying private rent, boarding, or site rent above a minimum threshold.',
        howTo: 'No separate claim needed — it is assessed when you claim your primary payment and update your rent details in myGov.',
        note: 'Rates vary by family situation and the amount of rent paid. Not available to social housing tenants.',
    },
    {
        icon: Shield,
        name: 'Medicare',
        amount: 'Covers 100% of GP and 85% of specialist scheduled fees',
        narwp: 'No waiting period for PR holders',
        color: '#00ff88',
        who: 'Australian citizens, permanent residents, and some temporary visa holders (via bilateral health agreements). Student visa holders from New Zealand, UK, Italy, Sweden, Belgium, Malta, Slovenia, and Norway may also be covered.',
        howTo: 'Enrol at any Medicare Service Centre (within Services Australia offices) with your passport and visa grant letter. You will receive a Medicare card within a few weeks.',
        note: 'Medicare does not cover ambulance, dental, optical, or most physiotherapy. Private health insurance is strongly recommended for gap coverage.',
    },
];

const registrationSteps = [
    {
        num: '01',
        title: 'Create a myGov account',
        detail: 'Go to my.gov.au and create an account using your email address. You will need to verify your identity — have your driver\'s licence, passport, or Medicare card ready.',
    },
    {
        num: '02',
        title: 'Link Services Australia to myGov',
        detail: 'From your myGov dashboard, select "Link a service" and choose Centrelink (Services Australia). Follow the prompts to link your existing Customer Reference Number (CRN) or create a new record.',
    },
    {
        num: '03',
        title: 'Visit a service centre (first-time claimants)',
        detail: 'If this is your first time accessing Centrelink, you may need to visit a Services Australia service centre in person with your passport and visa grant letter to prove your identity and confirm your immigration status.',
    },
    {
        num: '04',
        title: 'Complete your online claim',
        detail: 'Return to myGov and lodge your claim for the specific payment you are applying for. Answer all questions accurately — provide income, assets, and living arrangement information.',
    },
    {
        num: '05',
        title: 'Attend an appointment if required',
        detail: 'Some payments (particularly JobSeeker) require an initial appointment at a service centre or via phone. You may be connected to an employment services provider.',
    },
    {
        num: '06',
        title: 'Set up fortnightly income reporting',
        detail: 'Most payments require you to report your income every two weeks via the Express Plus Centrelink app or myGov. Failing to report on time can result in payment suspension.',
    },
];

const documents = [
    { icon: FileText, item: 'Passport (current) and Australian visa grant letter' },
    { icon: DollarSign, item: 'Bank account details — BSB and account number (Australian bank account required)' },
    { icon: FileText, item: 'Tax File Number (TFN) — apply via ATO if you don\'t have one' },
    { icon: Home, item: 'Proof of address — rental lease agreement or recent utility bill' },
    { icon: Users, item: 'Birth certificates of children (for Family Tax Benefit and Parenting Payment)' },
    { icon: FileText, item: 'Employment records or payslips (for income-tested payments)' },
    { icon: Shield, item: 'Medical records and specialist reports (for Disability Support Pension)' },
    { icon: FileText, item: 'Separation documents if applicable (for partner-status payments)' },
];

const usefulLinks = [
    { label: 'Services Australia', url: 'https://www.servicesaustralia.gov.au', desc: 'Official Centrelink portal — claims, eligibility, payment rates' },
    { label: 'myGov', url: 'https://my.gov.au', desc: 'Create an account and manage all government services in one place' },
    { label: 'Department of Social Services', url: 'https://www.dss.gov.au', desc: 'Policy, legislation and research on Australian welfare payments' },
    { label: 'Payment Finder', url: 'https://www.servicesaustralia.gov.au/payment-finder', desc: 'Use Services Australia\'s tool to see which payments you may be eligible for' },
    { label: 'Medicare Enrolment', url: 'https://www.servicesaustralia.gov.au/how-to-enrol-in-medicare', desc: 'Step-by-step guide to enrolling in Medicare as a new resident' },
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

const StatusIcon = ({ status }) => {
    if (status === 'yes') return <CheckCircle2 size={16} className="text-[#00ff88] shrink-0" />;
    if (status === 'no') return <XCircle size={16} className="text-[#ff6b6b] shrink-0" />;
    return <Minus size={16} className="text-[#ccff00] shrink-0" />;
};

const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-5">
        {children}
    </p>
);

const PaymentCard = ({ payment }) => {
    const [open, setOpen] = useState(false);
    const Icon = payment.icon;
    const isNoNarwp = payment.narwp.toLowerCase().includes('no waiting');

    return (
        <div className="bg-[#111] border border-white/5 overflow-hidden mb-3">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/2 transition-colors group"
            >
                <div className="p-2 shrink-0 mt-0.5" style={{ background: payment.color + '22' }}>
                    <Icon size={18} style={{ color: payment.color }} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="font-black uppercase tracking-tight text-sm text-white/90 group-hover:text-white transition-colors">
                            {payment.name}
                        </span>
                        {isNoNarwp && (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-[#00ff88]/15 text-[#00ff88] px-2 py-0.5">
                                NO WAIT
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-white/40 font-medium">{payment.amount}</p>
                </div>
                <div className="shrink-0 mt-1">
                    {open
                        ? <ChevronUp size={16} className="text-[#ccff00]" />
                        : <ChevronDown size={16} className="text-white/20" />}
                </div>
            </button>

            {open && (
                <div className="border-t border-white/5 px-5 pb-5 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white/3 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1.5">Amount</p>
                            <p className="text-xs text-white/70 leading-relaxed">{payment.amount}</p>
                        </div>
                        <div className="bg-white/3 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1.5">Waiting Period</p>
                            <p className={`text-xs font-bold leading-relaxed ${isNoNarwp ? 'text-[#00ff88]' : 'text-[#ccff00]'}`}>
                                {payment.narwp}
                            </p>
                        </div>
                        <div className="bg-white/3 p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1.5">How to Apply</p>
                            <p className="text-xs text-white/70 leading-relaxed">{payment.howTo}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1.5">Who is eligible?</p>
                        <p className="text-sm text-white/60 leading-relaxed">{payment.who}</p>
                    </div>
                    <div className="border-l-2 border-[#ccff00]/40 pl-3">
                        <p className="text-xs text-white/50 leading-relaxed italic">{payment.note}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Main Page ──────────────────────────────────────────────────────────────── */

const CentrelinkPage = () => {
    // useLanguage kept for future compatibility; page is English-only
    const { lang } = useLanguage();

    return (
        <>
            <SEOHead
                title="Centrelink & Government Benefits for Migrants | MIGRON"
                description="Your complete guide to Australia's welfare system as a migrant — eligibility by visa type, NARWP waiting periods, payment amounts, Medicare enrolment and how to register with Services Australia."
                path="/centrelink"
            />

            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* ── Hero ────────────────────────────────────────────────── */}
                <section className="relative pt-8 pb-8 px-6 border-b border-white/10">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                SOCIAL — WELFARE
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-[#ccff00]">
                                <Shield className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    CENTRELINK &amp; BENEFITS
                                </h1>
                                <p className="text-sm text-white/40 font-medium mt-1">
                                    GOVERNMENT WELFARE SYSTEM
                                </p>
                            </div>
                        </div>

                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl mt-4">
                            Your complete guide to Australia's welfare system as a migrant — who qualifies,
                            how long you must wait, what you can receive, and how to register.
                        </p>

                        {/* Quick stat pills */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {[
                                { label: '4-Year NARWP', sub: 'for most PR payments' },
                                { label: 'No Wait', sub: 'Child Care Subsidy' },
                                { label: 'Immediate', sub: 'Medicare for PR' },
                                { label: '9 Payments', sub: 'covered in this guide' },
                            ].map(p => (
                                <div key={p.label} className="bg-[#111] border border-white/5 px-4 py-2.5">
                                    <p className="text-xs font-black text-[#ccff00]">{p.label}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{p.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="max-w-[1000px] mx-auto px-6 py-10 space-y-14">

                    {/* ── What is Centrelink ───────────────────────────────── */}
                    <section>
                        <SectionLabel>01 — WHAT IS CENTRELINK?</SectionLabel>
                        <div className="bg-[#111] border border-white/5 p-6">
                            <p className="text-sm text-white/70 leading-relaxed mb-4">
                                Centrelink is the social welfare delivery arm of <strong className="text-white/90">Services Australia</strong> —
                                the Australian Government agency responsible for delivering welfare payments and services to eligible
                                individuals and families.
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed mb-4">
                                Centrelink payments cover a wide range of life situations: unemployment, raising children, disability,
                                ageing, and housing costs. Access is primarily through a <strong className="text-white/80">myGov account</strong> linked
                                to Services Australia — a single login that connects you to multiple government agencies
                                (ATO, Medicare, myHealth Record, etc.).
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                For migrants and visa holders, eligibility is determined primarily by your <strong className="text-white/80">visa subclass</strong> and
                                how long you have been a permanent resident. Most temporary visa holders have zero access.
                                Permanent residents have access after waiting periods. Australian citizens have full access from day one.
                            </p>
                        </div>
                    </section>

                    {/* ── Student visa callout ─────────────────────────────── */}
                    <div className="border border-[#ff6b6b]/40 bg-[#ff6b6b]/5 p-5 flex items-start gap-4">
                        <XCircle size={20} className="text-[#ff6b6b] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff6b6b] mb-2">
                                STUDENT VISA (500) HOLDERS — READ THIS FIRST
                            </p>
                            <p className="text-sm text-white/70 leading-relaxed">
                                You <strong className="text-white">cannot</strong> apply for any Centrelink payment on a Student Visa (subclass 500).
                                There is significant misinformation online about this. There are no exceptions — attempting to claim
                                is fraud and can lead to visa cancellation and criminal charges. Medicare may be available depending
                                on your country of origin via a bilateral health agreement.
                            </p>
                        </div>
                    </div>

                    {/* ── Eligibility Table ────────────────────────────────── */}
                    <section>
                        <SectionLabel>02 — ELIGIBILITY BY VISA TYPE</SectionLabel>
                        <div className="border border-white/5 overflow-hidden">
                            <div className="grid grid-cols-[1fr_auto_1fr] bg-white/3 border-b border-white/5">
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">VISA TYPE</div>
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">ACCESS</div>
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">NOTES</div>
                            </div>
                            {visaRows.map((row, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1fr_auto_1fr] border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                                >
                                    <div className="p-4 text-sm font-bold text-white/80">{row.visa}</div>
                                    <div className="p-4 flex flex-col items-center gap-1.5">
                                        <StatusIcon status={row.status} />
                                        <span className={`text-[9px] font-black uppercase tracking-wider text-center ${
                                            row.status === 'yes' ? 'text-[#00ff88]' :
                                            row.status === 'no' ? 'text-[#ff6b6b]' : 'text-[#ccff00]'
                                        }`}>
                                            {row.status === 'yes' ? 'FULL' : row.status === 'no' ? 'NONE' : 'LIMITED'}
                                        </span>
                                    </div>
                                    <div className="p-4 text-xs text-white/45 leading-relaxed">{row.note}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
                            Access status is a guide only. Individual circumstances can affect eligibility.
                            Always confirm with Services Australia before applying.
                        </p>
                    </section>

                    {/* ── Waiting Periods ──────────────────────────────────── */}
                    <section>
                        <SectionLabel>03 — WAITING PERIODS (NARWP)</SectionLabel>

                        <div className="bg-[#111] border border-white/5 p-6 mb-4">
                            <div className="flex items-start gap-3 mb-4">
                                <Clock size={18} className="text-[#ccff00] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight text-white/90 mb-2">
                                        Newly Arrived Resident's Waiting Period (NARWP)
                                    </p>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        Most new permanent residents must serve a <strong className="text-[#ccff00]">Newly Arrived Resident's Waiting Period (NARWP)</strong> before
                                        they can access most Centrelink payments. The NARWP starts from the date you first became a
                                        permanent resident of Australia (even if you later left and returned).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* NARWP breakdown table */}
                        <div className="border border-white/5 overflow-hidden mb-4">
                            <div className="grid grid-cols-[1fr_auto] bg-white/3 border-b border-white/5">
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">PAYMENT</div>
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">NARWP</div>
                            </div>
                            {[
                                { payment: 'JobSeeker Payment', wait: '4 years', color: 'text-[#ccff00]' },
                                { payment: 'Youth Allowance', wait: '4 years', color: 'text-[#ccff00]' },
                                { payment: 'Family Tax Benefit (A & B)', wait: '1 year', color: 'text-[#ccff00]' },
                                { payment: 'Parenting Payment', wait: '2 years', color: 'text-[#ccff00]' },
                                { payment: 'Disability Support Pension', wait: '10 years residence', color: 'text-[#ff6b6b]' },
                                { payment: 'Age Pension', wait: '10 years residence', color: 'text-[#ff6b6b]' },
                                { payment: 'Child Care Subsidy (CCS)', wait: 'No waiting period', color: 'text-[#00ff88]' },
                                { payment: 'Medicare', wait: 'Immediate for PR holders', color: 'text-[#00ff88]' },
                            ].map((r, i) => (
                                <div key={i} className="grid grid-cols-[1fr_auto] border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                                    <div className="p-4 text-sm text-white/70">{r.payment}</div>
                                    <div className={`p-4 text-sm font-black ${r.color} whitespace-nowrap`}>{r.wait}</div>
                                </div>
                            ))}
                        </div>

                        {/* Exemptions */}
                        <div className="bg-[#111] border border-white/5 p-5">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-3">NARWP EXEMPTIONS</p>
                            <ul className="space-y-2 text-sm text-white/60 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-[#00ff88] shrink-0 mt-0.5" />
                                    Humanitarian visa holders (subclasses 200, 201, 202, 203, 204, 866) — exempt from NARWP for most payments.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-[#00ff88] shrink-0 mt-0.5" />
                                    Australian citizens — no waiting period at all.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-[#00ff88] shrink-0 mt-0.5" />
                                    Previous PR holders who had a break in residency — the NARWP may have been served partially.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-[#00ff88] shrink-0 mt-0.5" />
                                    Special circumstances (domestic violence, severe financial hardship) — some exemptions exist for Crisis Payment.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* ── Payments Available ───────────────────────────────── */}
                    <section>
                        <SectionLabel>04 — PAYMENTS AVAILABLE</SectionLabel>
                        <p className="text-sm text-white/50 leading-relaxed mb-6">
                            Click each payment to expand eligibility details, amounts, and how to apply.
                            Amounts shown are current rates — they are indexed twice yearly (March and September).
                        </p>
                        {payments.map((p, i) => (
                            <PaymentCard key={i} payment={p} />
                        ))}
                    </section>

                    {/* ── How to Register ──────────────────────────────────── */}
                    <section>
                        <SectionLabel>05 — HOW TO REGISTER</SectionLabel>
                        <div className="space-y-3">
                            {registrationSteps.map((step, i) => (
                                <div key={i} className="bg-[#111] border border-white/5 p-5 flex items-start gap-5">
                                    <span className="text-3xl font-black text-white/10 leading-none shrink-0 w-10">
                                        {step.num}
                                    </span>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-tight text-white/90 mb-1.5">
                                            {step.title}
                                        </p>
                                        <p className="text-sm text-white/55 leading-relaxed">{step.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Documents Required ───────────────────────────────── */}
                    <section>
                        <SectionLabel>06 — DOCUMENTS REQUIRED</SectionLabel>
                        <div className="bg-[#111] border border-white/5 p-6">
                            <p className="text-sm text-white/60 leading-relaxed mb-5">
                                Gather these documents before starting your claim. Missing documents are the
                                most common reason for claim delays.
                            </p>
                            <ul className="space-y-3">
                                {documents.map((doc, i) => {
                                    const Icon = doc.icon;
                                    return (
                                        <li key={i} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                                            <Icon size={14} className="text-[#ccff00] shrink-0 mt-0.5" />
                                            <span className="text-sm text-white/65 leading-relaxed">{doc.item}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>

                    {/* ── myGov & Digital Access ───────────────────────────── */}
                    <section>
                        <SectionLabel>07 — MYGOV &amp; DIGITAL ACCESS</SectionLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                {
                                    title: 'myGov Account',
                                    body: 'my.gov.au is the central login for all Australian Government digital services. One account links Centrelink, Medicare, ATO (myTax), myHealth Record, and more.',
                                },
                                {
                                    title: 'Linking Centrelink',
                                    body: 'After creating your myGov account, go to "Link a service" → "Centrelink". You\'ll need your Customer Reference Number (CRN) or visit a service centre to get one.',
                                },
                                {
                                    title: 'Express Plus App',
                                    body: 'Download the Express Plus Centrelink app (iOS/Android) to report income, update details, and check payment status without logging into myGov each time.',
                                },
                            ].map((c, i) => (
                                <div key={i} className="bg-[#111] border border-white/5 p-5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] mb-2">{c.title}</p>
                                    <p className="text-sm text-white/60 leading-relaxed">{c.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Critical Warning ─────────────────────────────────── */}
                    <section>
                        <div className="border border-[#ff6b6b]/40 bg-[#ff6b6b]/5 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle size={20} className="text-[#ff6b6b] shrink-0 mt-0.5" />
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff6b6b]">
                                    CRITICAL WARNING — READ BEFORE APPLYING
                                </p>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Do not apply for payments you are not entitled to. Claiming welfare payments without eligibility is welfare fraud — a criminal offence under Australian law.',
                                    'Welfare fraud can result in visa cancellation, a permanent character finding against your migration record, and criminal prosecution.',
                                    'If you receive a payment in error or are overpaid, contact Services Australia immediately and arrange repayment. Delaying repayment significantly increases penalties.',
                                    'Centrelink has strong data-matching capabilities with the ATO and Home Affairs. Undisclosed income and immigration status changes are regularly detected.',
                                    'If you are unsure about your eligibility, do not guess — contact Services Australia directly or seek advice from a registered migration agent.',
                                ].map((w, i) => (
                                    <li key={i} className="flex items-start gap-3 pb-3 border-b border-[#ff6b6b]/10 last:border-0">
                                        <AlertTriangle size={13} className="text-[#ff6b6b] shrink-0 mt-0.5" />
                                        <span className="text-sm text-white/70 leading-relaxed">{w}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-white/40 mt-4 leading-relaxed">
                                Questions? Contact us at{' '}
                                <a href="mailto:migron@mtive.tech" className="text-[#ccff00] underline hover:brightness-125 transition-all">
                                    migron@mtive.tech
                                </a>
                                {' '}— we can point you to the right resources.
                            </p>
                        </div>
                    </section>

                    {/* ── Useful Links ─────────────────────────────────────── */}
                    <section>
                        <SectionLabel>08 — OFFICIAL RESOURCES</SectionLabel>
                        <div className="space-y-2">
                            {usefulLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 bg-[#111] border border-white/5 p-4 hover:border-[#ccff00]/30 hover:bg-white/2 transition-all group"
                                >
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-tight text-white/80 group-hover:text-white transition-colors mb-0.5">
                                            {link.label}
                                        </p>
                                        <p className="text-xs text-white/40">{link.desc}</p>
                                    </div>
                                    <ExternalLink size={14} className="text-white/20 group-hover:text-[#ccff00] transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>
                        <p className="text-[10px] text-white/25 mt-4 leading-relaxed">
                            Payment rates shown throughout this guide are current as of publication date and are updated
                            by Services Australia each March and September. Always verify current rates at
                            servicesaustralia.gov.au before making financial decisions.
                        </p>
                    </section>

                </div>
            </div>
        </>
    );
};

export default CentrelinkPage;
