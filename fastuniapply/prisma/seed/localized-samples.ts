// [DEMO DATA] — Arabic and Turkish translations for a representative
// sample of catalog entries (one university, one program, one scholarship),
// demonstrating the multilingual data model end-to-end and exercising the
// locale-fallback path (pickTranslation) for everything left English-only.
// Full trilingual content for the entire demo catalog is out of scope for
// seed data — production content is expected to be authored by the
// localization team via the future Admin > Translations module.

export const localizedUniversitySample = {
  slug: "istanbul-biruni-university",
  translations: [
    {
      locale: "ar" as const,
      name: "جامعة إسطنبول بيروني",
      aboutText: "جامعة خاصة حديثة في إسطنبول تتميز بكليات قوية في العلوم الصحية والهندسة وإدارة الأعمال، وهي شائعة بين الطلاب الدوليين لبرامجها التي تدرس باللغة الإنجليزية.",
      admissionRequirements: "شهادة الثانوية العامة، كشف الدرجات، نسخة من جواز السفر، إثبات الكفاءة في اللغة الإنجليزية (إن وجد).",
    },
    {
      locale: "tr" as const,
      name: "İstanbul Biruni Üniversitesi",
      aboutText: "İstanbul'da modern bir özel üniversite; sağlık bilimleri, mühendislik ve işletme alanlarında güçlü fakülteleriyle İngilizce eğitim veren programlarıyla uluslararası öğrenciler arasında popülerdir.",
      admissionRequirements: "Lise diploması, transkript, pasaport fotokopisi, İngilizce yeterlilik belgesi (gerekliyse).",
    },
  ],
};

export const localizedProgramSample = {
  slug: "computer-engineering-bachelors",
  translations: [
    {
      locale: "ar" as const,
      name: "هندسة الحاسوب",
      overview: "برنامج شامل مدته أربع سنوات يغطي هندسة البرمجيات والذكاء الاصطناعي وتصميم الأنظمة.",
    },
    {
      locale: "tr" as const,
      name: "Bilgisayar Mühendisliği",
      overview: "Yazılım mühendisliği, yapay zeka ve sistem tasarımını kapsayan kapsamlı dört yıllık bir program.",
    },
  ],
};

export const localizedScholarshipSample = {
  slug: "full-scholarship-turkiye",
  translations: [
    {
      locale: "ar" as const,
      title: "منحة تركيا بيليم الكاملة",
      providerName: "وزارة التعليم التركية",
      eligibilityText: "متاحة للطلاب الدوليين الحاصلين على معدل تراكمي لا يقل عن 3.0 المتقدمين للجامعات التركية الشريكة.",
    },
    {
      locale: "tr" as const,
      title: "Türkiye Bilim Tam Bursu",
      providerName: "Türkiye Millî Eğitim Bakanlığı",
      eligibilityText: "Ortalaması en az 3.0 olan ve ortak Türk üniversitelerine başvuran uluslararası öğrencilere açıktır.",
    },
  ],
};
