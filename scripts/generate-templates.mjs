import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType
} from 'docx';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'templates');
mkdirSync(OUT_DIR, { recursive: true });

// ─── Helpers ───────────────────────────────────────────────────────────────

const heading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({
    text,
    heading: level,
    spacing: { before: 300, after: 100 },
  });

const para = (text, opts = {}) =>
  new Paragraph({
    children: [new TextRun({ text, ...opts })],
    spacing: { after: 120 },
  });

const bold = (text) => new TextRun({ text, bold: true });
const normal = (text) => new TextRun({ text });

const bullet = (text) =>
  new Paragraph({
    children: [new TextRun({ text })],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });

const divider = () =>
  new Paragraph({
    thematicBreak: true,
    spacing: { before: 200, after: 200 },
  });

const empty = () => new Paragraph({ text: '' });

const label = (text) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: '222222' })],
    spacing: { before: 240, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
  });

const field = (text) =>
  new Paragraph({
    children: [new TextRun({ text, color: '555555', italics: true })],
    spacing: { after: 100 },
  });

const warning = (text) =>
  new Paragraph({
    children: [new TextRun({ text: '⚠️  ' + text, bold: true, color: 'CC0000' })],
    spacing: { before: 200, after: 200 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CC0000' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CC0000' },
    },
    shading: { type: ShadingType.SOLID, color: 'FFF5F5', fill: 'FFF5F5' },
  });

const footer = () => [
  divider(),
  para('Tüm şablonlar Migron tarafından hazırlanmıştır — migron.mtive.tech', { italics: true, color: '888888', size: 18 }),
  para('Son güncelleme: Mart 2026', { italics: true, color: '888888', size: 18 }),
];

const makeDoc = (children) =>
  new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 24 } },
      },
    },
    sections: [{ children }],
  });

// ─── ŞABLON 1: GTE Kişisel Beyan Mektubu ──────────────────────────────────

async function generateGTE() {
  const doc = makeDoc([
    heading('GTE KİŞİSEL BEYAN MEKTUBU'),
    new Paragraph({
      children: [new TextRun({ text: 'Genuine Temporary Entrant Statement', italics: true, color: '666666' })],
      spacing: { after: 60 },
    }),
    para('Öğrenci Vizesi (500) Başvurusu için', { italics: true, color: '888888' }),
    empty(),
    para('[TARİH]'),
    empty(),
    para('Avustralya Göçmenlik ve Vatandaşlık Bakanlığı\'na,'),
    empty(),
    new Paragraph({
      children: [bold('Re: Genuine Temporary Entrant Statement — '), normal('[ADINIZ SOYADINIZ]')],
      spacing: { after: 120 },
    }),
    divider(),
    label('1. Neden Bu Programı Seçtim'),
    field('[Programı seçme gerekçenizi buraya yazın. Örnek: Bu program, [mesleğiniz veya hedef alanınız] konusundaki bilgi ve becerilerimi geliştirmek için ihtiyacım olan müfredatı sunmaktadır. Özellikle [programın spesifik bir özelliği] benim için belirleyici olmuştur.]'),
    empty(),
    label('2. Neden Avustralya\'yı Seçtim'),
    field('[Avustralya tercih gerekçenizi buraya yazın. Örnek: Avustralya, [alanınızda] uluslararası alanda tanınan bir eğitim kalitesine sahiptir. Bunun yanı sıra çok kültürlü yapısı ve güvenli yaşam ortamı, yurt dışında eğitim almak için ideal bir destinasyon sunmaktadır.]'),
    empty(),
    label('3. Ülkeme Dönüş Niyetim'),
    para('Eğitimim tamamlandıktan sonra [ülkenize] dönmeyi planlamaktayım. Bu kararın temel nedenleri şunlardır:'),
    bullet('[Neden 1: Örnek — Ailem ve sosyal çevrem ülkemde bulunmaktadır]'),
    bullet('[Neden 2: Örnek — Edindiğim nitelikleri ülkemdeki [sektörde] değerlendirmeyi hedefliyorum]'),
    bullet('[Neden 3: Varsa — mülkiyet, iş bağlantısı, sosyal sorumluluk vb.]'),
    empty(),
    label('4. Kariyer Hedeflerim'),
    field('[Bu eğitimin kariyer planınıza katkısını açıklayın. Örnek: Bu program, [mesleğiniz] alanındaki kariyerimi ilerletmek için gerekli olan [spesifik beceri] konusundaki eksikliğimi gidermemi sağlayacaktır. Eğitim sonrasında [kariyer hedefi] konumuna ulaşmayı planlamaktayım.]'),
    divider(),
    para('Bu beyanın doğru ve eksiksiz olduğunu taahhüt ederim.'),
    empty(),
    para('Saygılarımla,'),
    empty(),
    para('[AD SOYAD]'),
    para('[PASAPORT NO]'),
    para('[İLETİŞİM]'),
    para('[TARİH]'),
    empty(),
    warning('Bu şablonu olduğu gibi kopyalama. Kendi durumuna özgü, kendi cümlelerinle doldur. GTE redlerinin en yaygın sebebi birbirinin kopyası metinlerdir.'),
    ...footer(),
  ]);
  const buf = await Packer.toBuffer(doc);
  writeFileSync(join(OUT_DIR, 'gte-beyan-mektubu.docx'), buf);
  console.log('✓ gte-beyan-mektubu.docx');
}

// ─── ŞABLON 2: 482 Vize İşveren Sponsor Mektubu ───────────────────────────

async function generate482() {
  const doc = makeDoc([
    heading('482 VİZESİ İŞVEREN SPONSOR MEKTUBU'),
    new Paragraph({
      children: [new TextRun({ text: 'TSS Visa — Employer Sponsorship Letter', italics: true, color: '666666' })],
      spacing: { after: 120 },
    }),
    empty(),
    para('[TARİH]'),
    empty(),
    para('Avustralya Göçmenlik ve Vatandaşlık Bakanlığı\'na,'),
    empty(),
    new Paragraph({
      children: [bold('Re: Sponsorship Support Letter — '), normal('[ÇALIŞANIN ADI SOYADI]')],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [normal('Ben/Biz, '), bold('[ŞİRKET ADI]'), normal(' adına, '), bold('[AD SOYAD]'), normal(' için Temporary Skill Shortage (TSS) Subclass 482 vize başvurusunu desteklediğimizi beyan etmekteyiz.')],
      spacing: { after: 200 },
    }),
    divider(),
    label('1. İşveren Bilgileri'),
    bullet('Şirket Adı: [ŞİRKET ADI]'),
    bullet('ABN: [ABN NUMARASI]'),
    bullet('Standard Business Sponsorship No: [SBS NUMARASI]'),
    bullet('Adres: [ŞİRKET ADRESİ]'),
    bullet('Yetkili Kişi: [AD SOYAD, ÜNVAN]'),
    empty(),
    label('2. Pozisyon Bilgileri'),
    bullet('Pozisyon Adı: [POZİSYON ADI]'),
    bullet('ANZSCO Kodu: [ANZSCO KODU]'),
    bullet('Çalışma Şekli: Tam zamanlı / Yarı zamanlı'),
    bullet('Haftalık Çalışma Saati: [SAAT]'),
    bullet('Yıllık Maaş: [TUTAR] AUD'),
    bullet('Çalışma Yeri: [ADRES]'),
    empty(),
    label('3. Pozisyonun Gereklilikleri'),
    para('Bu pozisyon için aşağıdaki nitelikler aranmaktadır:'),
    bullet('[Nitelik 1]'),
    bullet('[Nitelik 2]'),
    bullet('[Nitelik 3]'),
    empty(),
    label('4. Neden Avustralyalı Çalışan Bulunamadı (Labor Market Testing)'),
    field('[Şirket adı] olarak, bu pozisyonu doldurmak için Avustralyalı veya Avustralya daimi oturumuna sahip adayları işe almak amacıyla kapsamlı arayış gerçekleştirdik.'),
    bullet('[Tarih] tarihinde [platform] üzerinde ilan verilmiştir'),
    bullet('[X] başvuru alınmış, [Y] aday mülakata çağrılmıştır'),
    bullet('Avustralyalı adaylar arasında gerekli nitelikleri karşılayan uygun aday bulunamamıştır'),
    empty(),
    label('5. Adayın Uygunluğu'),
    new Paragraph({
      children: [bold('[AD SOYAD]'), normal(', bu pozisyon için gereken tüm niteliklere sahiptir:')],
      spacing: { after: 80 },
    }),
    bullet('[Nitelik/Deneyim 1]'),
    bullet('[Nitelik/Deneyim 2]'),
    bullet('[Nitelik/Deneyim 3]'),
    divider(),
    para('Bu başvuruyu desteklediğimizi ve [AD SOYAD]\'ın Avustralya\'daki çalışma sürecinde tüm yasal yükümlülükleri yerine getireceğimizi taahhüt ederiz.'),
    empty(),
    para('Saygılarımla,'),
    empty(),
    para('[YETKİLİ KİŞİ AD SOYAD]'),
    para('[ÜNVAN]'),
    para('[ŞİRKET ADI]'),
    para('[TARİH]'),
    para('[İMZA]'),
    ...footer(),
  ]);
  const buf = await Packer.toBuffer(doc);
  writeFileSync(join(OUT_DIR, '482-sponsor-mektubu.docx'), buf);
  console.log('✓ 482-sponsor-mektubu.docx');
}

// ─── ŞABLON 3: Avustralya CV Formatı ──────────────────────────────────────

async function generateCV() {
  const doc = makeDoc([
    heading('AVUSTRALYA CV FORMATI'),
    new Paragraph({
      children: [new TextRun({ text: 'Avustralya\'da CV, Türkiye\'deki özgeçmiş anlayışından farklıdır.', italics: true, color: '666666' })],
      spacing: { after: 200 },
    }),
    divider(),
    new Paragraph({
      children: [new TextRun({ text: '[AD SOYAD]', bold: true, size: 32 })],
      spacing: { after: 60 },
    }),
    para('[Şehir, Eyalet] | [Telefon] | [E-posta] | [LinkedIn — varsa]'),
    divider(),
    label('PROFESSIONAL SUMMARY'),
    field('[2–3 cümlelik profesyonel özet. Kim olduğunuzu, ne kadar deneyiminiz olduğunu ve ne arıyorsunuz kısaca belirtin.]'),
    para('Örnek: "Experienced [meslek] with [X] years in [sektör]. Proven track record in [beceri 1] and [beceri 2]. Seeking a [pozisyon türü] role where I can [hedef]."', { italics: true, color: '666666' }),
    divider(),
    label('WORK EXPERIENCE'),
    new Paragraph({
      children: [bold('[POZİSYON ADI]'), normal(' — [ŞİRKET ADI], [ŞEHİR/ÜLKE]')],
      spacing: { after: 40 },
    }),
    para('[Tarih Aralığı — Ay Yıl formatında]', { italics: true }),
    bullet('[Sorumluluk veya başarı — rakamla destekle]'),
    bullet('[Sorumluluk veya başarı]'),
    bullet('[Sorumluluk veya başarı]'),
    empty(),
    new Paragraph({
      children: [bold('[POZİSYON ADI]'), normal(' — [ŞİRKET ADI]')],
      spacing: { after: 40 },
    }),
    para('[Tarih Aralığı]', { italics: true }),
    bullet('[Sorumluluk]'),
    bullet('[Sorumluluk]'),
    divider(),
    label('EDUCATION'),
    new Paragraph({
      children: [bold('[DERECE/PROGRAM ADI]'), normal(' — [KURUM ADI]')],
      spacing: { after: 40 },
    }),
    para('[Tarih] | [Şehir, Ülke]', { italics: true }),
    divider(),
    label('SKILLS'),
    para('[Beceri 1] | [Beceri 2] | [Beceri 3] | [Beceri 4]'),
    divider(),
    label('CERTIFICATIONS'),
    bullet('[Sertifika Adı] — [Yıl]'),
    bullet('[Sertifika Adı] — [Yıl]'),
    divider(),
    label('REFERENCES'),
    para('Available upon request.'),
    divider(),
    warning('Avustralya CV Kuralları: Fotoğraf ekleme. Doğum tarihi yazma. Medeni durum, milliyet, din bilgisi yazma. Maksimum 2 sayfa (deneyimliysen 3). Referans olarak 2 kişi hazır tut, istendiğinde ver.'),
    ...footer(),
  ]);
  const buf = await Packer.toBuffer(doc);
  writeFileSync(join(OUT_DIR, 'avustralya-cv.docx'), buf);
  console.log('✓ avustralya-cv.docx');
}

// ─── ŞABLON 4: Cover Letter ───────────────────────────────────────────────

async function generateCoverLetter() {
  const doc = makeDoc([
    heading('COVER LETTER — ÖN YAZI'),
    divider(),
    para('[TARİH]'),
    empty(),
    para('[İŞVEREN / İK YETKİLİSİ ADI varsa]'),
    para('[ŞİRKET ADI]'),
    para('[ADRES]'),
    empty(),
    new Paragraph({
      children: [bold('Re: Application for '), normal('[POZİSYON ADI]'), bold(' — '), normal('[İLAN REFERANS KODU varsa]')],
      spacing: { after: 120 },
    }),
    para('Dear [İsim varsa / Dear Hiring Manager],'),
    empty(),
    field('I am writing to express my interest in the [POZİSYON ADI] position advertised on [PLATFORM]. With [X years] of experience in [sektör/alan], I am confident that my skills in [beceri 1] and [beceri 2] make me a strong candidate for this role.'),
    empty(),
    field('In my previous role at [ŞİRKET], I [spesifik bir başarı veya sorumluluk — rakamla destekle]. This experience has equipped me with [bu pozisyon için değerli bir beceri].'),
    empty(),
    field('I am particularly drawn to [ŞİRKET ADI] because [şirkete neden ilgi duyduğunuzu kısaca belirtin — araştır, samimi ol].'),
    empty(),
    para('I would welcome the opportunity to discuss how my experience aligns with your team\'s needs. Please find my resume attached for your consideration.'),
    empty(),
    para('Thank you for your time.'),
    empty(),
    para('Yours sincerely,'),
    para('[AD SOYAD]'),
    para('[TELEFON]'),
    para('[E-POSTA]'),
    ...footer(),
  ]);
  const buf = await Packer.toBuffer(doc);
  writeFileSync(join(OUT_DIR, 'cover-letter.docx'), buf);
  console.log('✓ cover-letter.docx');
}

// ─── ŞABLON 5: Referans Mektubu ───────────────────────────────────────────

async function generateReferans() {
  const doc = makeDoc([
    heading('REFERANS MEKTUBU'),
    new Paragraph({
      children: [new TextRun({ text: 'İş Başvurusu — İşverenden İstenecek', italics: true, color: '666666' })],
      spacing: { after: 200 },
    }),
    divider(),
    para('[TARİH]'),
    empty(),
    para('To Whom It May Concern,'),
    empty(),
    new Paragraph({
      children: [
        normal('I am writing to recommend '),
        bold('[ÇALIŞANIN ADI]'),
        normal(' who worked with us at '),
        bold('[ŞİRKET ADI]'),
        normal(' as a '),
        bold('[POZİSYON]'),
        normal(' from '),
        bold('[BAŞLAMA TARİHİ]'),
        normal(' to '),
        bold('[BIRAKMA TARİHİ]'),
        normal('.'),
      ],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        normal('During their time with us, '),
        bold('[AD]'),
        normal(' consistently demonstrated '),
        field('[özellik 1]'),
        normal(' and '),
        field('[özellik 2]'),
        normal('. Key contributions included:'),
      ],
      spacing: { after: 80 },
    }),
    bullet('[Başarı veya sorumluluk 1]'),
    bullet('[Başarı veya sorumluluk 2]'),
    empty(),
    new Paragraph({
      children: [bold('[AD]'), normal(' was a reliable, punctual and positive team member. I would not hesitate to recommend them for a similar role.')],
      spacing: { after: 120 },
    }),
    para('Please feel free to contact me for further information.'),
    empty(),
    para('Yours sincerely,'),
    empty(),
    para('[YETKİLİ KİŞİ AD SOYAD]'),
    para('[ÜNVAN]'),
    para('[ŞİRKET]'),
    para('[E-POSTA]'),
    para('[TELEFON]'),
    ...footer(),
  ]);
  const buf = await Packer.toBuffer(doc);
  writeFileSync(join(OUT_DIR, 'referans-mektubu.docx'), buf);
  console.log('✓ referans-mektubu.docx');
}

// ─── Run all ───────────────────────────────────────────────────────────────

Promise.all([generateGTE(), generate482(), generateCV(), generateCoverLetter(), generateReferans()])
  .then(() => console.log('\nTüm şablonlar public/templates/ klasörüne oluşturuldu.'))
  .catch(err => { console.error(err); process.exit(1); });
