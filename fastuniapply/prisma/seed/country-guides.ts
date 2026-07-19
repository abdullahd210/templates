export interface CountryGuideSeed {
  countrySlug: string;
  whyStudyHere: string;
  educationSystem: string;
  tuitionOverview: string;
  costOfLiving: string;
  visaInformation: string;
  accommodation: string;
  workOpportunities: string;
  requiredDocuments: string[];
}

// [DEMO DATA] — concise, realistic destination guides. Expand via
// Admin > Content > Study Destinations before production launch.
export const countryGuidesSeed: CountryGuideSeed[] = [
  {
    countrySlug: "turkiye",
    whyStudyHere: "Türkiye combines internationally accredited universities, low living costs, and a growing number of English-taught programs, making it one of the fastest-growing destinations for international students.",
    educationSystem: "Higher education is overseen by the Council of Higher Education (YÖK). Bachelor's degrees typically take 4 years, Master's 1–2 years, and many universities offer a one-year English preparatory program for students who need it.",
    tuitionOverview: "Private universities range from $2,000–$12,000/year depending on the program; medicine and dentistry are at the higher end. Public universities are significantly cheaper for eligible students.",
    costOfLiving: "Monthly living costs (rent, food, transport) typically range from $300–$600 depending on the city, with Istanbul at the higher end and smaller cities more affordable.",
    visaInformation: "Most students apply for a student visa at a Turkish consulate before travel, then obtain a residence permit within Türkiye after arrival. FastUniApply consultants guide you through both steps.",
    accommodation: "Options include university dormitories, private student residences, and shared apartments. Dormitory demand is high, so early application is recommended.",
    workOpportunities: "Students may work part-time (up to 24 hours/week) after their first year with proper authorization; internship opportunities are common in Istanbul and Ankara.",
    requiredDocuments: ["Passport", "High school or Bachelor's transcript", "Diploma", "Passport photos", "Language certificate (if applicable)"],
  },
  {
    countrySlug: "hungary",
    whyStudyHere: "Hungary is a top choice for medical and dental education, with EU-recognized degrees, historic universities, and tuition well below Western European levels.",
    educationSystem: "Hungarian higher education follows the Bologna process (Bachelor's/Master's/PhD structure). Medical programs use a direct 6-year MD structure rather than the Bachelor's–Master's split.",
    tuitionOverview: "Tuition ranges from $3,500–$18,000/year; medicine and dentistry are the most expensive programs, business and humanities are more affordable.",
    costOfLiving: "Budget $400–$700/month outside Budapest, or $600–$900/month in the capital, covering rent, food, and local transport.",
    visaInformation: "Non-EU students apply for a long-term (D-type) student visa before arrival, then register for a residence permit after enrollment.",
    accommodation: "University dormitories are common for first-year international students; private apartments are widely available in university cities afterward.",
    workOpportunities: "Students can work up to 24 hours/week during term and full-time during holidays, subject to visa conditions.",
    requiredDocuments: ["Passport", "Secondary school certificate", "Motivation letter", "Passport photos", "Proof of finances"],
  },
  {
    countrySlug: "germany",
    whyStudyHere: "Germany offers world-class engineering and research programs, many public universities with little or no tuition, and strong post-graduation career prospects in Europe's largest economy.",
    educationSystem: "German universities distinguish between Universities (research-focused) and Universities of Applied Sciences (practice-focused). Most Bachelor's programs are 3 years, Master's 1–2 years.",
    tuitionOverview: "Public universities charge minimal or no tuition (a small semester fee of €150–€350 is common); private universities range from €10,000–€20,000/year.",
    costOfLiving: "Expect €800–€1,200/month for rent, food, health insurance, and transport, with Munich and Berlin at the higher end.",
    visaInformation: "Non-EU students need a German student visa, proof of financial resources (via a blocked account), and university admission before applying.",
    accommodation: "Studierendenwerk (student services) dormitories are affordable but limited — apply as early as possible; shared flats (WGs) are the most common alternative.",
    workOpportunities: "International students may work 140 full days or 280 half days per year without a separate work permit.",
    requiredDocuments: ["Passport", "University entrance qualification", "Proof of financial resources", "Health insurance", "Language proficiency certificate"],
  },
  {
    countrySlug: "poland",
    whyStudyHere: "Poland offers EU-recognized degrees, a growing number of English-taught programs, and some of the most affordable tuition and living costs in the European Union.",
    educationSystem: "Poland follows the Bologna structure with Bachelor's, Master's, and PhD levels; medical and engineering programs are especially well regarded internationally.",
    tuitionOverview: "Tuition typically ranges from $2,500–$14,000/year, with medical programs at the top of that range.",
    costOfLiving: "Monthly costs of $350–$600 are typical outside Warsaw, and $500–$800 in the capital.",
    visaInformation: "Non-EU students apply for a national (type D) visa or a temporary residence permit for study purposes, depending on program length.",
    accommodation: "University dormitories are widely available and inexpensive; private rentals are also common in larger cities.",
    workOpportunities: "Students with a valid residence permit for study may work without an additional work permit in most cases.",
    requiredDocuments: ["Passport", "Secondary school certificate", "Transcript", "Passport photos", "Proof of financial means"],
  },
  {
    countrySlug: "italy",
    whyStudyHere: "Italy pairs a rich academic tradition with globally respected programs in business, design, and the arts, alongside an unmatched cultural and historical setting.",
    educationSystem: "Italian universities follow the 3+2 Bologna model (3-year Bachelor's, 2-year Master's); admission to some programs (e.g. medicine) requires a national entrance exam.",
    tuitionOverview: "Public university tuition is often income-based and can be as low as €900–€4,000/year; private universities and business schools range higher, up to €15,000+/year.",
    costOfLiving: "Budget €700–€1,100/month depending on the city, with Milan and Rome at the higher end.",
    visaInformation: "Non-EU students apply for a study visa at an Italian consulate, then obtain a residence permit (permesso di soggiorno) within 8 days of arrival.",
    accommodation: "University residences (collegi/case dello studente) are limited; most students rent shared apartments near campus.",
    workOpportunities: "Student visa holders may work up to 20 hours/week.",
    requiredDocuments: ["Passport", "Secondary school certificate", "Declaration of value (dichiarazione di valore)", "Passport photos", "Proof of financial means"],
  },
  {
    countrySlug: "malaysia",
    whyStudyHere: "Malaysia offers affordable, English-taught degrees, transnational programs with Western university partners, and a multicultural environment in the heart of Southeast Asia.",
    educationSystem: "Programs follow a British-influenced structure (3-year Bachelor's) and are regulated by the Malaysian Qualifications Agency (MQA); many universities offer twinning programs with UK/Australian institutions.",
    tuitionOverview: "Tuition ranges from $2,000–$10,000/year depending on the university and program, among the most affordable in Asia for English-medium education.",
    costOfLiving: "Monthly costs of $350–$600 are typical, covering accommodation, food, and local transport.",
    visaInformation: "Students apply for a Student Pass via the Ministry of Higher Education/EMGS after receiving an offer letter, processed with the university's assistance.",
    accommodation: "Most universities provide on-campus residential colleges; off-campus condominiums are also common near major campuses.",
    workOpportunities: "International students may work up to 20 hours/week during semester breaks with permission.",
    requiredDocuments: ["Passport", "Academic transcripts", "Passport photos", "Offer letter", "Medical examination report"],
  },
  {
    countrySlug: "united-kingdom",
    whyStudyHere: "The UK is home to some of the world's oldest and most prestigious universities, shorter-duration degrees (3-year Bachelor's, 1-year Master's), and strong global recognition.",
    educationSystem: "UK higher education is regulated with independent quality assurance; most Bachelor's degrees take 3 years (4 in Scotland), and Master's degrees typically take 1 year.",
    tuitionOverview: "International tuition ranges from £10,000–£38,000/year depending on the institution and subject, with medicine and MBA programs at the top end.",
    costOfLiving: "Budget £1,000–£1,500/month in London, or £800–£1,100/month elsewhere in the UK.",
    visaInformation: "Students apply for a Student visa (formerly Tier 4) using a Confirmation of Acceptance for Studies (CAS) from their university.",
    accommodation: "University halls of residence are common in the first year; private shared housing is typical afterward.",
    workOpportunities: "Student visa holders may generally work up to 20 hours/week during term time and full-time during vacations.",
    requiredDocuments: ["Passport", "CAS reference", "Academic transcripts", "English proficiency test", "Proof of financial means"],
  },
  {
    countrySlug: "united-states",
    whyStudyHere: "The US offers unmatched breadth of programs, flexible liberal-arts-style curricula, and access to leading research institutions and industry connections.",
    educationSystem: "US Bachelor's degrees typically take 4 years with a flexible credit/major system; Master's programs range 1–2 years depending on the field.",
    tuitionOverview: "Tuition varies enormously, from around $10,000/year at public state universities (out-of-state/international rates) to $60,000+/year at private institutions.",
    costOfLiving: "Monthly living costs range from $1,000–$2,500 depending heavily on the city and campus location.",
    visaInformation: "Students apply for an F-1 visa using a Form I-20 issued by their university after admission and proof of financial support.",
    accommodation: "On-campus dormitories are common for first-year students; off-campus apartments are typical from the second year onward.",
    workOpportunities: "F-1 students may work up to 20 hours/week on-campus during term; off-campus work generally requires CPT/OPT authorization.",
    requiredDocuments: ["Passport", "Form I-20", "SEVIS fee receipt", "Academic transcripts", "Proof of financial support"],
  },
  {
    countrySlug: "canada",
    whyStudyHere: "Canada combines high-quality, internationally recognized education with a clear pathway from study permit to post-graduation work permit and, for many, permanent residency.",
    educationSystem: "Canadian Bachelor's degrees typically take 3–4 years; Master's programs range 1–2 years, with many co-op (work-integrated) options available.",
    tuitionOverview: "International tuition ranges from CAD $15,000–$35,000/year depending on the province, institution, and program.",
    costOfLiving: "Budget CAD $1,200–$2,000/month depending on the city, with Toronto and Vancouver at the higher end.",
    visaInformation: "Students apply for a Canadian study permit after receiving an acceptance letter from a Designated Learning Institution (DLI).",
    accommodation: "On-campus residences are available at most institutions; off-campus shared housing is common in larger cities.",
    workOpportunities: "Eligible study permit holders may work up to 24 hours/week off-campus during term and full-time during scheduled breaks.",
    requiredDocuments: ["Passport", "Letter of acceptance", "Proof of financial support", "Academic transcripts", "Statement of purpose"],
  },
  {
    countrySlug: "cyprus",
    whyStudyHere: "Cyprus offers affordable, English-taught EU-recognized degrees in a Mediterranean setting, with a large and welcoming international student community.",
    educationSystem: "Cyprus follows the Bologna structure; both the Republic of Cyprus and North Cyprus host internationally accredited universities with American- and British-influenced curricula.",
    tuitionOverview: "Tuition typically ranges from $3,000–$10,000/year, among the most affordable English-taught options in the Mediterranean.",
    costOfLiving: "Monthly costs of $500–$800 are typical, including accommodation, food, and transport.",
    visaInformation: "Non-EU students apply for a student visa/residence permit through their university's international office after admission.",
    accommodation: "Most universities offer on-campus or nearby managed dormitories; off-campus apartments are also widely available.",
    workOpportunities: "Part-time work opportunities exist on and around campus, subject to visa conditions.",
    requiredDocuments: ["Passport", "Secondary school or Bachelor's transcript", "Passport photos", "Proof of financial means", "Health insurance"],
  },
  {
    countrySlug: "united-arab-emirates",
    whyStudyHere: "The UAE combines globally ranked university branch campuses, a tax-free, multicultural business hub, and strong regional career opportunities across the Gulf.",
    educationSystem: "Many UAE institutions are branch campuses of well-known international universities or accredited under the UAE Ministry of Education, following Western-style credit systems.",
    tuitionOverview: "Tuition typically ranges from $10,000–$30,000/year depending on the institution and program, with international branch campuses at the higher end.",
    costOfLiving: "Monthly costs range from $800–$1,500 depending on the emirate, with Dubai and Abu Dhabi at the higher end.",
    visaInformation: "Universities typically sponsor a student residence visa on behalf of enrolled international students as part of the admission process.",
    accommodation: "Most universities offer on-campus or partner student housing; shared apartments are also common in Dubai and Abu Dhabi.",
    workOpportunities: "Some universities offer part-time work permits for students; internships with UAE-based multinational companies are common.",
    requiredDocuments: ["Passport", "Academic transcripts", "Passport photos", "Proof of financial means", "Medical fitness certificate"],
  },
];
