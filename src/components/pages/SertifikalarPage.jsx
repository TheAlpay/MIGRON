import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Award, CheckCircle, AlertCircle, Clock,
    DollarSign, Monitor, Search, X, BookOpen, Shield,
    Truck, Heart, Laptop, Wrench, Building2, TrendingUp, Home, GraduationCap,
} from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';
import LiveExperimentBand from '../shared/LiveExperimentBand';

/* ─────────────────────────── VISA COLOUR CONFIG ──────────────────────── */
const VISA_CONFIG = {
    '417': { color: '#ccff00', bg: '#ccff0020' },
    '462': { color: '#ccff00', bg: '#ccff0020' },
    '500': { color: '#00d4ff', bg: '#00d4ff20' },
    '482': { color: '#ff9500', bg: '#ff950020' },
    '189': { color: '#00ff88', bg: '#00ff8820' },
    '190': { color: '#00ff88', bg: '#00ff8820' },
    '491': { color: '#b388ff', bg: '#b388ff20' },
};

/* ──────────────────────────── CATEGORIES ─────────────────────────────── */
const CATEGORIES = [
    { key: 'food',      label: 'Food & Beverage',        icon: '🍽️', IconComp: BookOpen },
    { key: 'construction', label: 'Construction & Site', icon: '🏗️', IconComp: Building2 },
    { key: 'security',  label: 'Security',               icon: '🛡️', IconComp: Shield },
    { key: 'children',  label: 'Children & Care',        icon: '👶', IconComp: Heart },
    { key: 'it',        label: 'IT & Technology',        icon: '💻', IconComp: Laptop },
    { key: 'health',    label: 'Health & Aged Care',     icon: '🏥', IconComp: Heart },
    { key: 'transport', label: 'Transport & Logistics',  icon: '🚛', IconComp: Truck },
    { key: 'finance',   label: 'Finance & Business',     icon: '💼', IconComp: TrendingUp },
    { key: 'realestate',label: 'Real Estate & Property', icon: '🏠', IconComp: Home },
    { key: 'education', label: 'Education & Training',   icon: '🎓', IconComp: GraduationCap },
    { key: 'trades',    label: 'Trades & Maintenance',   icon: '🔧', IconComp: Wrench },
];

/* ──────────────────────────── CERTIFICATES ──────────────────────────── */
const CERTIFICATES = [

    /* ═══════════════ FOOD & BEVERAGE ═══════════════ */
    {
        id: 'rsa',
        category: 'food',
        name: 'RSA — Responsible Service of Alcohol',
        code: 'SITHFAB021',
        cost: '$50–80 AUD',
        duration: '4–6 hours',
        how: 'Online',
        visas: ['417', '462', '500', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Bar', 'Restaurant', 'Café', 'Events', 'Bottle Shop'],
        note: "A legal requirement at all venues serving alcohol in every Australian state. Australia's fastest door-opening certificate for new migrants — complete it online in a single day for under $80.",
    },
    {
        id: 'rsg',
        category: 'food',
        name: 'RSG — Responsible Service of Gambling',
        code: null,
        cost: '$50–80 AUD',
        duration: '4–6 hours',
        how: 'Online',
        visas: ['417', '462', '500', '482'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Casino', 'TAB', 'Venues with Gaming Machines', 'Pubs'],
        note: 'Legally required in any venue that operates gaming machines (pokies). Combined with RSA, you become a full-package hospitality worker that employers actively seek out.',
    },
    {
        id: 'food_safety_supervisor',
        category: 'food',
        name: 'Food Safety Supervisor Certificate',
        code: 'SITXFSA005 + SITXFSA006',
        cost: '$80–150 AUD',
        duration: '1 day',
        how: 'Online or in-person',
        visas: ['417', '462', '500', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Kitchen', 'Café', 'Fast Food', 'Catering', 'Hospital Food Service'],
        note: 'Every food business must have at least one certified Food Safety Supervisor on the premises. This is one level above the Food Handler certificate and makes you eligible for supervisory kitchen roles.',
    },
    {
        id: 'food_handler',
        category: 'food',
        name: 'Food Handler Certificate',
        code: null,
        cost: '$20–50 AUD',
        duration: '2–3 hours',
        how: 'Online',
        visas: ['417', '462', '500'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Kitchen', 'Café', 'Fast Food', 'Catering', 'Supermarket'],
        note: 'The most affordable entry point into Australia\'s food industry. Low cost, fast completion — do it the day before a job interview to demonstrate initiative.',
    },
    {
        id: 'barista',
        category: 'food',
        name: 'Barista Certificate',
        code: null,
        cost: '$200–400 AUD',
        duration: '1–2 days',
        how: 'In-person',
        visas: ['417', '462', '500', '482'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Café', 'Restaurant', 'Hotel', 'Catering'],
        note: "Coffee culture is extraordinary in Australia — barista skills are tested hands-on in virtually every café interview. A formal certificate signals seriousness and cuts through competition from casual applicants.",
    },

    /* ═══════════════ CONSTRUCTION & SITE ═══════════════ */
    {
        id: 'whitecard',
        category: 'construction',
        name: 'White Card — Construction Induction',
        code: 'CPCCWHS1001',
        cost: '$80–150 AUD',
        duration: '1 day',
        how: 'Online or in-person',
        visas: ['417', '462', '500', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Construction', 'Landscaping', 'Renovation', 'Roadworks', 'Mining Infrastructure'],
        note: 'Legally mandatory before setting foot on any construction site in Australia. Nationally recognised and never expires. Get this first — it unlocks the entire construction sector immediately.',
    },
    {
        id: 'forklift',
        category: 'construction',
        name: 'Forklift Licence — LF Class',
        code: 'LF (High Risk Work Licence)',
        cost: '$300–500 AUD',
        duration: '2–3 days',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Warehouse', 'Factory', 'Logistics', 'Construction', 'Retail Distribution'],
        note: 'Issued by WorkCover/SafeWork — a High Risk Work Licence required by law to operate any forklift. Cross-listed across construction and transport/logistics due to universal applicability.',
    },
    {
        id: 'working_at_heights',
        category: 'construction',
        name: 'Working at Heights',
        code: null,
        cost: '$200–400 AUD',
        duration: '1 day',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Construction', 'Maintenance', 'Telecommunications', 'Roofing', 'Window Cleaning'],
        note: 'Mandatory for any work performed above 2 metres. A non-negotiable requirement on commercial construction sites and a quick add-on after your White Card.',
    },
    {
        id: 'ewp',
        category: 'construction',
        name: 'Elevated Work Platform (EWP) Licence',
        code: 'WP (High Risk Work Licence)',
        cost: '$300–500 AUD',
        duration: '2 days',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Construction', 'Maintenance', 'Telecommunications', 'Events'],
        note: 'Required by law to operate boom lifts, scissor lifts, and cherry pickers. Significantly boosts hourly rates in civil construction and maintenance work.',
    },
    {
        id: 'firstaid',
        category: 'construction',
        name: 'First Aid Certificate',
        code: 'HLTAID011',
        cost: '$100–150 AUD',
        duration: '1 day',
        how: 'In-person',
        visas: ['417', '462', '500', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Construction', 'Security', 'Childcare', 'Sports Facilities', 'All Sectors'],
        note: 'Valid for 3 years. Required for security work and childcare, and a preferred qualification in virtually every other sector. Add it to any job application for instant credibility.',
    },
    {
        id: 'cpr',
        category: 'construction',
        name: 'CPR Certificate',
        code: 'HLTAID009',
        cost: '$30–60 AUD',
        duration: '3–4 hours',
        how: 'In-person',
        visas: ['417', '462', '500', '482', '189', '190'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['All Sectors'],
        note: 'Requires annual renewal. A shorter and cheaper version of the full First Aid certificate — sufficient for workplaces that require basic life-support readiness without full first-aid coverage.',
    },
    {
        id: 'asbestos',
        category: 'construction',
        name: 'Asbestos Awareness Training',
        code: null,
        cost: '$50 AUD',
        duration: '2–3 hours',
        how: 'Online',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Construction', 'Renovation', 'Demolition', 'Maintenance'],
        note: 'Legally required for anyone working on or near structures built before 1990. Australia has one of the world\'s highest rates of asbestos-related disease — this training is taken seriously on every site.',
    },
    {
        id: 'traffic_control',
        category: 'construction',
        name: 'Traffic Control — Stop/Slow Bat',
        code: 'RIIWHS302E',
        cost: '$300–500 AUD',
        duration: '2–3 days',
        how: 'In-person',
        visas: ['417', '462', '482'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Construction', 'Roadworks', 'Events', 'Utilities'],
        note: 'Required by law to direct traffic at roadworks or events. Combined with a White Card this creates a strong entry-level construction profile — traffic control roles are abundant and pay well above minimum wage.',
    },

    /* ═══════════════ SECURITY ═══════════════ */
    {
        id: 'security_licence',
        category: 'security',
        name: 'Security Licence — Certificate II in Security Operations',
        code: 'CPP20218',
        cost: '$400–800 AUD',
        duration: '3–6 months (TAFE or RTO)',
        how: 'In-person (TAFE or RTO)',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: true,
        isMandatory: true,
        sectors: ['Security', 'Events', 'Shopping Centre', 'Nightclub', 'Hospital', 'Retail'],
        note: 'Mandatory to work legally as a security guard in any Australian state. Weekend and night shift rates are significantly above the national average — a reliable income pathway for newly arrived migrants.',
    },
    {
        id: 'security_firstaid',
        category: 'security',
        name: 'First Aid — Required for Security Licence',
        code: 'HLTAID011',
        cost: '$100–150 AUD',
        duration: '1 day',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Security'],
        note: 'You cannot obtain or renew a Security Licence without a current First Aid certificate. Always complete this before starting the security course to avoid delays.',
    },
    {
        id: 'security_cpr',
        category: 'security',
        name: 'CPR — Annual Renewal for Security Workers',
        code: 'HLTAID009',
        cost: '$30–60 AUD',
        duration: '3–4 hours',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Security'],
        note: 'Security industry regulations require CPR to be renewed every 12 months. Budget for this as an annual operating cost of maintaining your licence.',
    },

    /* ═══════════════ CHILDREN & CARE ═══════════════ */
    {
        id: 'wwc',
        category: 'children',
        name: 'Working with Children Check — WWC',
        code: null,
        cost: '$80 AUD NSW / Free QLD & VIC',
        duration: 'Online application — 1–4 weeks processing',
        how: 'Online (state government portal)',
        visas: ['417', '462', '500', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Childcare', 'Education', 'Sports Clubs', 'Volunteer Work', 'Health'],
        note: 'Mandatory for anyone working or volunteering with people under 18 in Australia. Each state issues its own check — apply in the state where you will be working. Cost and processing time vary by state.',
    },
    {
        id: 'childcare_firstaid',
        category: 'children',
        name: 'First Aid for Childcare — Paediatric',
        code: 'HLTAID012',
        cost: '$200–300 AUD',
        duration: '1 day',
        how: 'In-person',
        visas: ['500', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Childcare Centre', 'Family Day Care', 'Kindergarten', 'OOSH'],
        note: 'This paediatric-specific first aid unit is a regulatory requirement under the National Quality Framework for all early childhood services. It must be renewed every 3 years.',
    },
    {
        id: 'ece_cert3',
        category: 'children',
        name: 'Certificate III in Early Childhood Education & Care',
        code: 'CHC30121',
        cost: '$2,000–8,000 AUD (or subsidised via government)',
        duration: '6–12 months',
        how: 'In-person or blended (TAFE)',
        visas: ['500', '482', '189', '190'],
        isTAFE: true,
        isMandatory: true,
        sectors: ['Childcare Centre', 'Kindergarten', 'Family Day Care', 'OOSH'],
        note: "AQF Level 3 — the minimum qualification required by law to work in a regulated childcare service in Australia. The sector faces a critical national shortage; this qualification is on the priority migration occupation list.",
    },
    {
        id: 'cert4_school_age',
        category: 'children',
        name: 'Certificate IV in School Age Education and Care',
        code: 'CHC40121',
        cost: '$2,000–6,000 AUD',
        duration: '12 months',
        how: 'Blended (TAFE)',
        visas: ['500', '482', '189', '190'],
        isTAFE: true,
        isMandatory: false,
        sectors: ['Out of School Hours Care (OOSH)', 'Vacation Care', 'Before & After School Programs'],
        note: 'The advanced pathway after Cert III. Required for Coordinator-level roles in OOSH and vacation care programs. A strong qualification for the PR skills assessment pathway.',
    },

    /* ═══════════════ IT & TECHNOLOGY ═══════════════ */
    {
        id: 'comptia_a',
        category: 'it',
        name: 'CompTIA A+',
        code: null,
        cost: '$500–800 AUD (exam + prep)',
        duration: 'Self-paced study + online exam',
        how: 'Online (Pearson VUE exam centre)',
        visas: ['500', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['IT Support', 'Help Desk', 'Technical Service'],
        note: "Internationally recognised foundational IT certificate — the gold standard for proving IT competency to an Australian employer when your overseas qualifications aren't recognised locally.",
    },
    {
        id: 'comptia_security',
        category: 'it',
        name: 'CompTIA Security+',
        code: null,
        cost: '$400–700 AUD (exam + prep)',
        duration: 'Self-paced study + online exam',
        how: 'Online (Pearson VUE exam centre)',
        visas: ['482', '189', '190'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Cybersecurity', 'IT Infrastructure', 'Government & Defence'],
        note: 'The baseline cybersecurity certification globally and increasingly the floor requirement for security-adjacent roles in Australian government and enterprise IT.',
    },
    {
        id: 'aws_cp',
        category: 'it',
        name: 'AWS Certified Cloud Practitioner',
        code: null,
        cost: '$150 AUD (exam fee)',
        duration: '2–3 months self-paced preparation',
        how: 'Online exam',
        visas: ['482', '189', '190', '500'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Cloud Computing', 'IT Operations', 'DevOps'],
        note: 'The entry point into the AWS certification pathway. Cloud roles are the fastest-growing IT segment in Australia — this cert validates foundational cloud literacy to any employer.',
    },
    {
        id: 'azure_az900',
        category: 'it',
        name: 'Microsoft Azure Fundamentals — AZ-900',
        code: 'AZ-900',
        cost: '$200 AUD (exam fee)',
        duration: '4–6 weeks self-paced preparation',
        how: 'Online exam',
        visas: ['482', '189', '190', '500'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Cloud Computing', 'Enterprise IT', 'Microsoft Ecosystem'],
        note: "Australia's enterprise sector runs heavily on the Microsoft stack. AZ-900 is the quickest credential to prove Azure familiarity and opens doors to Azure Administrator and Developer pathways.",
    },
    {
        id: 'google_pca',
        category: 'it',
        name: 'Google Professional Cloud Architect',
        code: null,
        cost: '$300 AUD (exam fee)',
        duration: '3–6 months preparation',
        how: 'Online or remote proctored exam',
        visas: ['482', '189', '190'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Cloud Architecture', 'DevOps', 'Platform Engineering'],
        note: "One of the most respected architect-level cloud certifications globally. Positions you for senior engineering and solutions architect roles — high-demand, high-salary tier in Australia's tech market.",
    },
    {
        id: 'ccna',
        category: 'it',
        name: 'Cisco CCNA — Networking Associate',
        code: null,
        cost: '$400–600 AUD (exam + prep)',
        duration: '3–6 months preparation',
        how: 'Online or in-person exam',
        visas: ['482', '189', '190', '500'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Network Engineering', 'IT Infrastructure', 'Telco'],
        note: "The industry standard for networking credentials. Particularly valuable in Australia's telecommunications sector and for ISP, enterprise networking, and managed services roles.",
    },

    /* ═══════════════ HEALTH & AGED CARE ═══════════════ */
    {
        id: 'cert3_individual_support',
        category: 'health',
        name: 'Certificate III in Individual Support — Aged Care',
        code: 'CHC33021',
        cost: '$2,000–5,000 AUD (or free via government funding)',
        duration: '6–12 months',
        how: 'Blended — online + mandatory practical placement',
        visas: ['500', '482', '189', '190', '491'],
        isTAFE: true,
        isMandatory: true,
        sectors: ['Aged Care', 'Home Care', 'Residential Facilities', 'Community Services'],
        note: "Mandatory minimum qualification for NDIS and aged care employment under the Aged Care Quality Standards. Australia is experiencing a critical workforce shortage in this sector — it appears on the Medium and Long-term Strategic Skills List (MLTSSL).",
    },
    {
        id: 'ndis_orientation',
        category: 'health',
        name: 'NDIS Worker Orientation Module',
        code: null,
        cost: 'Free',
        duration: '1–2 hours',
        how: 'Online (NDIS Commission website)',
        visas: ['417', '462', '500', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Disability Support Services', 'NDIS', 'Aged Care'],
        note: 'Mandatory for all new workers entering the NDIS system. Completely free and completed online in under 2 hours — there is no reason not to complete this before your first support shift.',
    },
    {
        id: 'manual_handling',
        category: 'health',
        name: 'Manual Handling & Safe Patient Handling',
        code: null,
        cost: '$50–100 AUD',
        duration: 'Online or half-day in-person',
        how: 'Online or in-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Aged Care', 'Hospital', 'Disability Support', 'Warehousing'],
        note: 'Required by workplace health and safety legislation in all care and physical work environments. Protects you from back injury and is often a Day 1 induction requirement before your first shift.',
    },
    {
        id: 'medication_admin',
        category: 'health',
        name: 'Medication Administration Certificate',
        code: null,
        cost: '$200–400 AUD',
        duration: '1 day',
        how: 'In-person (RTO)',
        visas: ['482', '189', '190'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Aged Care', 'Disability Support', 'Home Care'],
        note: 'Unlocks higher-paid support worker roles where medication assistance is part of the duty of care. Many employers sponsor this training once you are working — ask before self-funding.',
    },
    {
        id: 'hoist_sling',
        category: 'health',
        name: 'Hoist & Sling Training',
        code: null,
        cost: '$150–300 AUD',
        duration: 'Half day',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Aged Care', 'Disability Support', 'Hospital'],
        note: 'Legally required before operating any patient lifting equipment. Residential aged care facilities cannot roster you for certain shifts without current hoist competency documentation.',
    },
    {
        id: 'cert4_disability',
        category: 'health',
        name: 'Certificate IV in Disability Support',
        code: 'CHC43121',
        cost: '$3,000–6,000 AUD (government subsidies available)',
        duration: '12 months',
        how: 'Blended (TAFE or RTO)',
        visas: ['500', '482', '189', '190'],
        isTAFE: true,
        isMandatory: false,
        sectors: ['Disability Support', 'NDIS', 'Community Services'],
        note: 'The advanced pathway after Cert III — opens Team Leader and Case Management roles. With NDIS funding growing year-on-year, Cert IV holders are in very strong demand.',
    },
    {
        id: 'infection_control',
        category: 'health',
        name: 'Infection Control Training',
        code: null,
        cost: 'Free (government-funded)',
        duration: '1–2 hours',
        how: 'Online',
        visas: ['417', '462', '500', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Aged Care', 'Hospital', 'Childcare', 'Allied Health'],
        note: 'Became a mandatory requirement for all aged care workers post-COVID. Free, fast, and completed online — do it immediately, as most aged care employers verify completion during hiring.',
    },

    /* ═══════════════ TRANSPORT & LOGISTICS ═══════════════ */
    {
        id: 'hr_licence',
        category: 'transport',
        name: 'Heavy Rigid (HR) Truck Licence',
        code: null,
        cost: '$500–1,500 AUD',
        duration: 'Varies by state — 1–3 days practical',
        how: 'In-person (state road authority)',
        visas: ['417', '462', '482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Long Haul Transport', 'Urban Delivery', 'Construction', 'Mining'],
        note: 'Australia has a severe truck driver shortage — HR licence holders can find full-time work within days of obtaining this licence in most states. Enables driving rigid trucks over 8 tonnes GVM.',
    },
    {
        id: 'mc_licence',
        category: 'transport',
        name: 'Multi-Combination (MC) Truck Licence',
        code: null,
        cost: '$3,000–5,000 AUD',
        duration: '3–5 days practical assessment',
        how: 'In-person (state road authority)',
        visas: ['482', '189', '190', '491'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['B-Double Transport', 'Road Train', 'Interstate Freight'],
        note: 'The highest truck licence class — required for B-doubles and road trains. MC-licensed drivers command some of the highest wages in the transport sector, particularly on interstate runs.',
    },
    {
        id: 'forklift_transport',
        category: 'transport',
        name: 'Forklift Licence — LF Class',
        code: 'LF (High Risk Work Licence)',
        cost: '$300–500 AUD',
        duration: '2–3 days',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Warehouse', 'Freight Terminal', 'Retail Distribution', 'Manufacturing'],
        note: 'The single most-requested qualification in warehouse and logistics job ads. Issued by WorkCover/SafeWork — a High Risk Work Licence required by law to operate any forklift in Australia.',
    },
    {
        id: 'dangerous_goods',
        category: 'transport',
        name: 'Dangerous Goods Transport — ADG Certificate',
        code: null,
        cost: '$300–600 AUD',
        duration: '1–2 days',
        how: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Chemical Transport', 'Fuel Delivery', 'Mining Logistics', 'Warehousing'],
        note: 'Legally required under the Australian Dangerous Goods Code for anyone involved in transporting, handling or loading classified hazardous substances. Comes with a pay premium above standard freight roles.',
    },
    {
        id: 'cor',
        category: 'transport',
        name: 'Chain of Responsibility (CoR) Training',
        code: null,
        cost: '$100–200 AUD',
        duration: 'Online — 3–5 hours',
        how: 'Online',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Transport Management', 'Logistics Operations', 'Fleet Management'],
        note: 'Required under the Heavy Vehicle National Law (HVNL). CoR means managers and business owners — not just drivers — are legally responsible for transport safety. Essential for anyone in a logistics management role.',
    },

    /* ═══════════════ FINANCE & BUSINESS ═══════════════ */
    {
        id: 'cert4_accounting',
        category: 'finance',
        name: 'Certificate IV in Accounting and Bookkeeping',
        code: 'FNS40222',
        cost: '$2,000–5,000 AUD (TAFE)',
        duration: '12 months',
        how: 'Online or in-person (TAFE)',
        visas: ['500', '482', '189', '190'],
        isTAFE: true,
        isMandatory: false,
        sectors: ['Bookkeeping', 'Accounts Payable/Receivable', 'Payroll', 'Small Business'],
        note: 'The minimum qualification required to legally register as a BAS (Business Activity Statement) Agent with the Tax Practitioners Board. A clear pathway from overseas accounting experience into the Australian market.',
    },
    {
        id: 'tax_agent',
        category: 'finance',
        name: 'Tax Agent Registration — Tax Practitioners Board',
        code: 'TPB Registration',
        cost: '$300–500 AUD (registration fee)',
        duration: 'Qualification + 1,000 hours supervised experience',
        how: 'Application via TPB (taxpractitioners.gov.au)',
        visas: ['482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Accounting Firm', 'Tax Consulting', 'Financial Services'],
        note: "Legally required to lodge tax returns for clients in Australia — it is a criminal offence to provide tax agent services without registration. The TPB assesses overseas qualifications — check eligibility before applying.",
    },
    {
        id: 'afsl',
        category: 'finance',
        name: 'Australian Financial Services Licence — AFSL',
        code: 'AFSL (ASIC regulated)',
        cost: '$500–2,000 AUD (application fee — varies)',
        duration: '3–6 months application process',
        how: 'Application via ASIC (asic.gov.au)',
        visas: ['482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Financial Planning', 'Investment Advice', 'Insurance Brokering', 'Fund Management'],
        note: 'Regulated by ASIC — required by law to provide financial products or advice to clients in Australia. Individual advisers must also complete a relevant degree and the FASEA exam (now under ASIC).',
    },

    /* ═══════════════ REAL ESTATE & PROPERTY ═══════════════ */
    {
        id: 're_registration',
        category: 'realestate',
        name: 'Certificate of Registration — Real Estate',
        code: 'CPP41419 (NSW) / State-specific',
        cost: '$500–1,200 AUD',
        duration: '3–6 months',
        how: 'Online or in-person (RTO)',
        visas: ['482', '189', '190', '500'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Residential Sales', 'Property Management', 'Commercial Real Estate'],
        note: 'State-specific — each state has different requirements and issuing authorities (e.g., NSW Fair Trading, Consumer Affairs VIC). The Certificate of Registration is the mandatory first step to work in real estate in Australia.',
    },
    {
        id: 're_licence',
        category: 'realestate',
        name: 'Real Estate Agent Licence — Full Licence',
        code: 'CPP51122 (NSW) / State-specific',
        cost: '$1,500–4,000 AUD',
        duration: '12–24 months (after 1–2 years of experience)',
        how: 'Blended (RTO)',
        visas: ['189', '190', '482'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Licensed Agent in Charge', 'Own Your Own Agency', 'Senior Property Management'],
        note: 'Allows you to operate independently as a licensed agent or run your own real estate agency. Requires prior experience as a registered agent. The pathway to business ownership in the property sector.',
    },

    /* ═══════════════ EDUCATION & TRAINING ═══════════════ */
    {
        id: 'tae40122',
        category: 'education',
        name: 'Certificate IV in Training and Assessment',
        code: 'TAE40122',
        cost: '$1,500–3,000 AUD',
        duration: '6–12 months',
        how: 'Blended (TAFE or RTO)',
        visas: ['500', '482', '189', '190'],
        isTAFE: true,
        isMandatory: true,
        sectors: ['RTO Trainer', 'Corporate Trainer', 'Assessor', 'Facilitator', 'TAFE Lecturer'],
        note: 'Mandatory to deliver or assess nationally recognised training in Australia — no TAE40122 means you cannot legally work as a trainer in any Registered Training Organisation (RTO). Widely considered the most strategically valuable certificate in the Australian workforce development ecosystem.',
    },
    {
        id: 'education_wwc',
        category: 'education',
        name: 'Working with Children Check — Education Settings',
        code: null,
        cost: '$80 AUD NSW / Free QLD & VIC',
        duration: 'Online application — 1–4 weeks processing',
        how: 'Online (state government portal)',
        visas: ['417', '462', '500', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Schools', 'TAFE', 'Tutoring', 'Libraries', 'Youth Programs'],
        note: 'Mandatory for any role in any educational setting where you may have unsupervised contact with minors. Apply in your state before starting your role — working without this check is a criminal offence.',
    },

    /* ═══════════════ TRADES & MAINTENANCE ═══════════════ */
    {
        id: 'electrical_licence',
        category: 'trades',
        name: 'Electrical Licence — Electrician',
        code: 'State-specific (e.g., NSW: Electrical Contractor Licence)',
        cost: '$300–800 AUD (licence fee — trade qualification required separately)',
        duration: 'After completing electrical trade apprenticeship (4 years)',
        how: 'Application via state regulator (e.g., NSW Fair Trading)',
        visas: ['189', '190', '482', '491'],
        isTAFE: true,
        isMandatory: true,
        sectors: ['Residential Electrical', 'Commercial Electrical', 'Industrial Electrical'],
        note: 'Strictly state-specific. Overseas electricians must have their qualifications assessed by Engineers Australia or VETASSESS before applying. Electricians appear on the MLTSSL — a direct PR pathway.',
    },
    {
        id: 'plumbing_licence',
        category: 'trades',
        name: 'Plumbing Licence',
        code: 'State-specific',
        cost: '$200–600 AUD (licence fee)',
        duration: 'After completing plumbing trade apprenticeship (4 years)',
        how: 'Application via state regulator',
        visas: ['189', '190', '482', '491'],
        isTAFE: true,
        isMandatory: true,
        sectors: ['Residential Plumbing', 'Commercial Plumbing', 'Civil Works'],
        note: "Plumbers are on Australia's priority occupation list. Skills assessment is done through the Plumbing Industry Commission or state plumbing regulators. One of the most direct PR pathways for tradespeople.",
    },
    {
        id: 'gas_fitting',
        category: 'trades',
        name: 'Gas Fitting Licence',
        code: 'State-specific',
        cost: '$200–500 AUD (separate from plumbing licence)',
        duration: 'Separate endorsement — weeks to months',
        how: 'In-person assessment + application',
        visas: ['189', '190', '482'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Residential Gas', 'Commercial Kitchen Gas', 'Industrial Gas'],
        note: 'A separate licence from plumbing — even licensed plumbers cannot do gas work without this specific endorsement. Significantly increases your earning potential and job scope.',
    },
    {
        id: 'carpenter_joiner',
        category: 'trades',
        name: 'Carpentry & Joinery Trade Certificate',
        code: 'CPC30220',
        cost: '$3,000–8,000 AUD (or subsidised apprenticeship)',
        duration: '3–4 year apprenticeship (TAFE component)',
        how: 'Apprenticeship — on-the-job + TAFE',
        visas: ['482', '189', '190', '491'],
        isTAFE: true,
        isMandatory: false,
        sectors: ['Residential Construction', 'Commercial Fitout', 'Furniture Making', 'Formwork'],
        note: "Carpenters are on Australia's Medium and Long-term Strategic Skills List. Overseas-qualified carpenters should seek a skills assessment via VETASSESS or Trades Recognition Australia (TRA) before applying for a licence.",
    },
    {
        id: 'cleaning_cert',
        category: 'trades',
        name: 'Certificate II in Cleaning Operations',
        code: 'CPP20616',
        cost: '$200–500 AUD',
        duration: '3–6 months',
        how: 'Online or in-person',
        visas: ['417', '462', '500', '482', '189', '190'],
        isTAFE: false,
        isMandatory: false,
        sectors: ['Commercial Cleaning', 'Hospitality Cleaning', 'Healthcare Cleaning', 'Industrial Cleaning'],
        note: 'A fast and affordable route into stable employment. Healthcare and pharmaceutical cleaning require this formal qualification — hospital cleaning roles pay significantly more than standard commercial cleaning.',
    },
    {
        id: 'pesticide_licence',
        category: 'trades',
        name: 'Pesticide Applicator Licence',
        code: 'State-specific',
        cost: '$200–500 AUD',
        duration: '1–3 days + application',
        how: 'In-person (approved training provider)',
        visas: ['417', '462', '482', '189', '190'],
        isTAFE: false,
        isMandatory: true,
        sectors: ['Pest Control', 'Agriculture', 'Horticulture', 'Facilities Management'],
        note: 'Legally required to commercially apply scheduled pesticides in Australia. State-issued — check your state agriculture department. Pest control technicians are in steady demand across urban and regional areas.',
    },
];

/* ─────────────────────────── SECTOR PATHWAYS ─────────────────────────── */
const SECTOR_PATHWAYS = [
    { icon: '☕', label: 'Café & Restaurant',   path: 'Food Handler → RSA + RSG → Food Safety Supervisor → Barista' },
    { icon: '🏗️', label: 'Construction & Site', path: 'White Card → Working at Heights → Traffic Control → Forklift or EWP' },
    { icon: '🛡️', label: 'Security',            path: 'First Aid → Security Licence → Annual CPR Renewal' },
    { icon: '💻', label: 'IT & Tech',            path: 'CompTIA A+ → Network+ → Security+ or AWS Cloud Practitioner' },
    { icon: '🤝', label: 'Care Services',        path: 'WWC Check → Cert III Individual Support → NDIS Orientation → Medication Admin' },
    { icon: '🚛', label: 'Transport & Logistics',path: 'Forklift LF → HR Licence → Dangerous Goods → CoR Training' },
    { icon: '🏥', label: 'Aged Care Pathway',   path: 'NDIS Orientation (free) → Infection Control (free) → Cert III Individual Support → Cert IV Disability' },
    { icon: '🎓', label: 'Education & Training', path: 'WWC Check → TAE40122 Certificate IV in Training & Assessment' },
];

/* ─────────────────────────── SUB-COMPONENTS ──────────────────────────── */
const VisaBadge = ({ visa }) => {
    const cfg = VISA_CONFIG[visa] ?? { color: '#ffffff', bg: '#ffffff15' };
    return (
        <span
            className="text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider rounded-sm"
            style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
        >
            {visa}
        </span>
    );
};

const CertCard = ({ cert }) => (
    <div className="bg-[#111] border border-white/5 p-6 flex flex-col gap-4 hover:border-white/15 transition-all duration-200">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-tight text-white leading-snug mb-1">
                    {cert.name}
                </h3>
                {cert.code && (
                    <span className="text-[10px] text-white/30 font-mono break-all">{cert.code}</span>
                )}
            </div>
            <div className="shrink-0 flex flex-col gap-1 items-end">
                {cert.isMandatory && (
                    <div className="flex items-center gap-1 px-2 py-0.5" style={{ backgroundColor: '#ff6b6b18', border: '1px solid #ff6b6b40' }}>
                        <AlertCircle size={9} className="text-[#ff6b6b]" />
                        <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[#ff6b6b]">MANDATORY</span>
                    </div>
                )}
                {cert.isTAFE && (
                    <div className="flex items-center gap-1 px-2 py-0.5" style={{ backgroundColor: '#00d4ff12', border: '1px solid #00d4ff40' }}>
                        <CheckCircle size={9} className="text-[#00d4ff]" />
                        <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[#00d4ff]">TAFE</span>
                    </div>
                )}
            </div>
        </div>

        {/* ── Sectors ── */}
        <div className="flex flex-wrap gap-1.5">
            {cert.sectors.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 bg-white/5 text-white/40 uppercase tracking-wider">
                    {s}
                </span>
            ))}
        </div>

        {/* ── Details grid ── */}
        <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
                <DollarSign size={13} className="text-white/20 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Cost</p>
                    <p className="text-white/70 font-bold text-[11px] leading-snug">{cert.cost}</p>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <Clock size={13} className="text-white/20 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Duration</p>
                    <p className="text-white/70 font-bold text-[11px] leading-snug">{cert.duration}</p>
                </div>
            </div>
            <div className="flex items-start gap-2 col-span-2">
                <Monitor size={13} className="text-white/20 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Delivery</p>
                    <p className="text-white/70 font-bold text-[11px]">{cert.how}</p>
                </div>
            </div>
        </div>

        {/* ── Visa badges ── */}
        <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] text-white/25 uppercase tracking-wider mr-0.5">Visa:</span>
            {cert.visas.map(v => <VisaBadge key={v} visa={v} />)}
        </div>

        {/* ── Note ── */}
        <p className="text-[11px] text-white/40 leading-relaxed border-t border-white/5 pt-3 italic">
            {cert.note}
        </p>
    </div>
);

/* ─────────────────────────── PAGE COMPONENT ──────────────────────────── */
const SertifikalarPage = () => {
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchQuery, setSearchQuery]   = useState('');

    const filteredCerts = useMemo(() => {
        let list = CERTIFICATES;
        if (activeFilter !== 'ALL') {
            list = list.filter(c => c.category === activeFilter);
        }
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.code && c.code.toLowerCase().includes(q)) ||
                c.sectors.some(s => s.toLowerCase().includes(q)) ||
                c.note.toLowerCase().includes(q)
            );
        }
        return list;
    }, [activeFilter, searchQuery]);

    /* Group for "ALL" view */
    const groupedForAll = useMemo(() => {
        if (activeFilter !== 'ALL' || searchQuery.trim()) return null;
        return CATEGORIES.map(cat => ({
            cat,
            certs: CERTIFICATES.filter(c => c.category === cat.key),
        }));
    }, [activeFilter, searchQuery]);

    const totalCount = CERTIFICATES.length;

    return (
        <>
            <SEOHead
                title="Australian Certifications Guide for Migrants | MIGRON"
                description="Comprehensive guide to 30+ industry certifications in Australia — food, construction, security, IT, health, transport, finance, real estate, education, and trades. Everything migrants need to know."
                path="/sertifikalar"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* ── Hero ── */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                EDUCATION — CERTIFICATIONS
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <Award className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                CERTIFICATIONS
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl mb-3">
                            All certifications that matter for migrants working in Australia — {totalCount}+ certificates across {CATEGORIES.length} industries, with costs, durations, and visa compatibility.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-[#ff6b6b] font-black uppercase tracking-wider">
                                <AlertCircle size={10} />
                                Red badge = legally required
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-[#00d4ff] font-black uppercase tracking-wider">
                                <CheckCircle size={10} />
                                Blue badge = available at TAFE
                            </span>
                        </div>
                    </div>
                </section>

                <div className="max-w-[1200px] mx-auto px-6 py-8">

                    {/* ── TAFE Info Box ── */}
                    <div className="border border-[#ccff00]/40 bg-[#ccff00]/5 p-5 mb-8 flex items-start gap-4">
                        <div className="text-2xl shrink-0">🎓</div>
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-2">
                                STUDENT VISA HOLDER? READ THIS FIRST
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                TAFE (Technical and Further Education — varies by state) offers significant discounts on many certificate courses for valid student visa holders.
                                Always check <strong className="text-white/80">before enrolling</strong> — bring your student card in person, as discounts are
                                rarely applied automatically online. You must specifically mention your student status to receive the concession pricing.
                            </p>
                        </div>
                    </div>

                    <LiveExperimentBand />

                    {/* ── Search Bar ── */}
                    <div className="relative mt-6 mb-4">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search certificates, codes, or sectors..."
                            className="w-full bg-[#111] border border-white/10 text-white/70 text-sm pl-10 pr-10 py-3 placeholder:text-white/25 focus:outline-none focus:border-[#ccff00]/40 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* ── Category Filter ── */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <button
                            onClick={() => setActiveFilter('ALL')}
                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                                activeFilter === 'ALL'
                                    ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                            }`}
                        >
                            ALL ({totalCount})
                        </button>
                        {CATEGORIES.map(cat => {
                            const count = CERTIFICATES.filter(c => c.category === cat.key).length;
                            return (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveFilter(cat.key)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                                        activeFilter === cat.key
                                            ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                                    }`}
                                >
                                    {cat.icon} {cat.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Certificate Grid ── */}
                    {searchQuery.trim() || activeFilter !== 'ALL' ? (
                        /* Flat filtered view */
                        <div className="mb-12">
                            {filteredCerts.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-white/25 text-sm uppercase tracking-widest">No certificates match your search.</p>
                                </div>
                            ) : (
                                <>
                                    {searchQuery.trim() && (
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-4">
                                            {filteredCerts.length} result{filteredCerts.length !== 1 ? 's' : ''} for "{searchQuery}"
                                        </p>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredCerts.map(cert => <CertCard key={cert.id} cert={cert} />)}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* Grouped by category view */
                        <div className="space-y-12 mb-12">
                            {groupedForAll.map(({ cat, certs }) => (
                                <div key={cat.key}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="text-xl">{cat.icon}</span>
                                        <h2
                                            className="text-[11px] font-black tracking-[0.3em] uppercase"
                                            style={{ color: '#ccff00' }}
                                        >
                                            {cat.label}
                                        </h2>
                                        <span className="text-[10px] text-white/20 font-mono">
                                            — {certs.length} certificate{certs.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {certs.map(cert => <CertCard key={cert.id} cert={cert} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Recommended Pathways ── */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-8">
                        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-1">
                            WHERE SHOULD I START?
                        </h2>
                        <p className="text-[11px] text-white/40 mb-6 uppercase tracking-wider">
                            Recommended certificate pathways by target sector
                        </p>
                        <div className="space-y-4">
                            {SECTOR_PATHWAYS.map((p, i) => (
                                <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                    <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-white uppercase mb-1">{p.label}</p>
                                        <p className="text-xs text-white/40 leading-relaxed">{p.path}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Visa Legend ── */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-8">
                        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50 mb-4">
                            VISA SUBCLASS LEGEND
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                ['417', 'Working Holiday (1st)'],
                                ['462', 'Work & Holiday (2nd)'],
                                ['500', 'Student Visa'],
                                ['482', 'Temporary Skill Shortage'],
                                ['189', 'Skilled Independent (PR)'],
                                ['190', 'Skilled Nominated (PR)'],
                                ['491', 'Skilled Work Regional'],
                            ].map(([code, label]) => {
                                const cfg = VISA_CONFIG[code] ?? { color: '#fff', bg: '#ffffff15' };
                                return (
                                    <div key={code} className="flex items-center gap-2">
                                        <span
                                            className="text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider shrink-0"
                                            style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
                                        >
                                            {code}
                                        </span>
                                        <span className="text-[10px] text-white/40">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default SertifikalarPage;
