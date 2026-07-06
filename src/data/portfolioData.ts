export interface Position {
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  type?: string;
  responsibilities: string[];
  category: "Clinical" | "Research" | "Leadership" | "Education";
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  date: string;
  doi?: string;
  type: "Peer-Reviewed" | "Preprint" | "Case Report" | "Under Review";
  role: string;
  link?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Reference {
  name: string;
  title: string;
  organization: string;
  relationship: string;
  email: string;
  phone?: string;
}

export interface VolunteerWork {
  organization: string;
  event?: string;
  location: string;
  date: string;
  responsibilities: string[];
}

export const portfolioData = {
  personalInfo: {
    name: "Dr. Rahul Parajuli",
    degrees: "MBBS",
    title: "ECFMG-certified Physician & Clinical Researcher",
    email: "dr.rahulparajuli@gmail.com",
    alternateEmail: "rahulparajuli007@gmail.com",
    website: "mail@rahulparajuli.com.np",
    phone: "+977-9801120884",
    alternatePhone: "+1 (240) 861-3328",
    location: "Biratnagar, Nepal",
    linkedin: "https://www.linkedin.com/in/zxtraul",
    orcid: "0000-0003-0223-3185",
    summary: "ECFMG-certified (USMLE Step 1, 2 and 3) and GCP-certified Physician with 3+ years of Level 3 ICU clinical experience and a robust background in Clinical Research and Regulatory Compliance. Proven expertise in proposal development, IRB submissions, and managing multicentric studies across 20 ICUs. U.S. Clinical Exposure at UPMC with familiarity in Epic/Meditech EMR and SPSS data analysis."
  },
  interests: [
    "Critical care outcomes (sepsis, ARDS, shock, CLABSI, CAUTI, ventilator-associated complications)",
    "QI and patient safety (medication errors, burnout studies)",
    "Cardiovascular and Pulmonary Medicine",
    "Antimicrobial stewardship and resistance patterns",
    "Infectious and tropical diseases",
    "Artificial Intelligence in Health"
  ],
  education: [
    {
      degree: "Primary Medical Degree: MBBS",
      institution: "East West Medical College & Hospital, Dhaka University, Dhaka, Bangladesh",
      date: "Jan 2015 - Nov 2021"
    },
    {
      degree: "10+2 Programme in Science",
      institution: "Shikshadeep Higher Secondary Boarding School, Biratnagar, Nepal",
      date: "2012 - 2014"
    },
    {
      degree: "School Leaving Certificate (S.L.C)",
      institution: "Sagarmatha Higher Secondary Boarding School, Biratnagar, Nepal",
      date: "2012"
    }
  ],
  positions: [
    {
      title: "Medical Officer, Emergency Department",
      organization: "Morang Co-operative Hospital",
      location: "Biratnagar, Nepal",
      startDate: "Oct 2025",
      endDate: "Present",
      type: "FULL TIME",
      category: "Clinical",
      responsibilities: [
        "Manage acute emergencies (trauma, cardiac arrest, stroke, respiratory failure, acute pulmonary edema).",
        "Provide immediate medical care for life-threatening conditions.",
        "Efficiently categorize patients based on the severity of their condition to ensure timely intervention for high-priority cases.",
        "Order and interpret diagnostic tests, including bedside ultrasounds (FAST/eFAST), EKGs, ABG and laboratory investigations.",
        "Perform procedures: intubation, pleural and ascitic fluid tapping, central venous and dialysis catheter insertion, chest tube placement, and wound debridement/suturing.",
        "Lead ACLS/ATLS resuscitations and multidisciplinary coordination.",
        "Oversee regular patients in the Hemodialysis Department and perform bedside insertion of non-tunneled hemodialysis catheters for dialysis-naive patients."
      ]
    },
    {
      title: "Research Officer",
      organization: "Nepal Intensive Care Research Foundation (NICRF)",
      location: "Kathmandu, Nepal",
      startDate: "Dec 2025",
      endDate: "Present",
      category: "Research",
      responsibilities: [
        "Coordinate and perform multicentric studies among 20 ICUs of Nepal participating in the National ICU Registry.",
        "Ensured regulatory affairs, including IRB/NHRC proposal submissions and protocol adherence, ensuring strict GCP compliance for single and multicentric studies.",
        "Optimized data integrity through rigorous cleaning protocols, statistical analysis (SPSS), manuscript drafting and publishing it to an indexed peer-reviewed journal.",
        "Involved in various trainings, learning sessions and bootcamp related to enrich Clinical Research Skills.",
        "Co-investigator: 'Burnout among critical care nurses in tertiary-level hospitals of Nepal'.",
        "Co-investigator: 'Knowledge, Attitude and Practice (KAP) of antimicrobial prescription, resistance and stewardship among clinical doctors in Nepal'.",
        "Co-investigator: 'Medication errors in Intensive Care Unit'."
      ]
    },

    {
      title: "Incharge, Medical Officers",
      organization: "Hospital for Advanced Medicine & Surgery (HAMS)",
      location: "Kathmandu, Nepal",
      startDate: "Oct 2023",
      endDate: "Mar 2025",
      type: "FULL TIME",
      category: "Leadership",
      responsibilities: [
        "Leadership & Supervision: Oversee and coordinate the team of medical officers, ensuring smooth day-to-day hospital operations.",
        "Scheduling & Workforce Management: Manage duty rosters, shift allocations, and leave approvals to maintain optimal staffing.",
        "Policy Implementation: Ensure adherence to hospital protocols, administrative policies, and regulatory standards.",
        "Training & Mentorship: Guide medical officers in professional development and hospital workflow.",
        "Interdepartmental Coordination: Act as a liaison between medical officers of different wards and medical officers with hospital administration.",
        "Performance Monitoring: Evaluate medical officers' efficiency, address challenges, and provide constructive feedback.",
        "Crisis Management: Handle emergencies related to staff shortages, conflict resolution, and operational disruptions.",
        "Quality Improvement Initiatives: Participate in hospital committees, quality improvement audits, and process optimization.",
        "Recruitment & Onboarding: Assist in hiring and integrating new medical officers into the hospital system."
      ]
    },
    {
      title: "Clinical Research (ICU-based)",
      organization: "Hospital for Advanced Medicine & Surgery (HAMS)",
      location: "Kathmandu, Nepal",
      startDate: "Jan 2022",
      endDate: "Mar 2025",
      category: "Research",
      responsibilities: [
        "Designed and executed retrospective and cross-sectional studies in ICU settings.",
        "Led a team of medical officers in the execution of case reports and case series development and submissions to indexed journals.",
        "Collaborated with intensivists for data collection, outcome analysis, and publication."
      ]
    },
    {
      title: "Medical Officer, Intensive Care Unit",
      organization: "Hospital for Advanced Medicine & Surgery (HAMS)",
      location: "Kathmandu, Nepal",
      startDate: "Jan 2022",
      endDate: "Mar 2025",
      type: "FULL TIME",
      category: "Clinical",
      responsibilities: [
        "Managed critically ill patients in the Level 3 ICU under supervision.",
        "Critical Care Management: Monitoring and stabilizing critically ill patients. Endotracheal intubation and basic ventilator management. Central venous catheter and arterial line insertion. Dialysis catheter insertion. Lumbar puncture and cerebrospinal fluid analysis. Management of sepsis and shock. Interpretation of ABG and 12-lead ECG. Basic POCUS skills. Sedation and analgesia optimization. DVT and Stress ulcer prophylaxis.",
        "Postoperative monitoring and management of patients who underwent CABG, PCI, and EPS.",
        "Multidisciplinary Coordination: Collaboration with intensivists, other primary physicians, and surgeons. Participation in daily ICU rounds and treatment modifications. Coordination with radiology and pathology for diagnostics.",
        "Emergency & Procedural Expertise: Leading and assisting in code blue resuscitations. Management of vasoactive and inotropic medications. Antibiotic Stewardship.",
        "Patient & Family Communication: Counseling families on prognosis and treatment plans. Maintaining accurate medical records and progress notes.",
        "Clinical Research: Involved in conducting original studies within ICU and in multicentric approach. Write and submit case reports and case series. Submitting proposal of studies to IRB of the hospital and NHRC."
      ]
    },
    {
      title: "Airport Physician, Emergency Medical Care",
      organization: "HAMS Hospital—A Joint Venture with Tribhuvan International Airport",
      location: "Kathmandu, Nepal",
      startDate: "Jul 2024",
      endDate: "Feb 2025",
      type: "PART-TIME",
      category: "Clinical",
      responsibilities: [
        "Provided emergency medical care to passengers, staff, and airport personnel at Tribhuvan International Airport (TIA).",
        "Collaborated with a multidisciplinary team in handling medical emergencies, stabilizing patients and referrals to tertiary centers.",
        "Played a key role in responding to high-pressure situations and ensuring prompt medical interventions.",
        "Gained valuable experience in pre-hospital emergency care, trauma management, and acute medical conditions."
      ]
    },
    {
      title: "MBBS",
      organization: "East West Medical College and Hospital",
      location: "Dhaka",
      startDate: "Jan 2015",
      endDate: "Nov 2021",
      category: "Education",
      responsibilities: []
    }
  ],
  publications: [
    {
      id: "pub1",
      title: "Diagnostic yield of malignant pleural effusion in various primary and metastatic cancers: Insights across cancer subtypes.",
      authors: ["Rahul Parajuli (Co-investigator)"],
      journal: "Pulmonary Medicine (Wiley)",
      date: "March 2026",
      doi: "10.1155/pm/8469617",
      type: "Peer-Reviewed",
      role: "Co-investigator",
      link: "https://doi.org/10.1155/pm/8469617"
    },
    {
      id: "pub2",
      title: "A Rare Case of Pyoderma Gangrenosum as a Complication of Ulcerative Colitis: A Case Report and Literature Review.",
      authors: ["Rahul Parajuli (Co-Author)"],
      journal: "Clinical Case Reports (Wiley)",
      date: "October 2025",
      doi: "10.1002/ccr3.71291",
      type: "Case Report",
      role: "Co-Author",
      link: "https://doi.org/10.1002/ccr3.71291"
    },
    {
      id: "pub3",
      title: "New-onset seizure in peripartum period: a case of Sjögren's syndrome with renal artery stenosis.",
      authors: ["Rahul Parajuli (First Author)"],
      journal: "Oxford Medical Case Reports (OUP)",
      date: "September 2025",
      doi: "10.1093/omcr/omaf199",
      type: "Case Report",
      role: "First Author",
      link: "https://doi.org/10.1093/omcr/omaf199"
    },
    {
      id: "pub4",
      title: "The Heart-Brain-Liver Axis: A Systematic Review and Meta-Analysis of How Cirrhosis Sabotages Heart Rate Variability.",
      authors: ["Rahul Parajuli (First Author)"],
      journal: "Wiley Liver International",
      date: "June 2026",
      type: "Under Review",
      role: "First Author"
    },
    {
      id: "pub5",
      title: "Efficacy and Safety of Alendronate Combined With Calcium and Vitamin D in Patients with Cirrhotic Osteoporosis: A Prospective Comparative Study.",
      authors: ["Rahul Parajuli (Co-investigator)"],
      journal: "Frontiers in Gastroenterology - Hepatology",
      date: "May 2026",
      type: "Under Review",
      role: "Co-investigator"
    },
    {
      id: "pub6",
      title: "Hepatitis B and C Seroprevalence in Nepal: Lessons from Mass Pre-Departure Screening of Emigrant Workers.",
      authors: ["Rahul Parajuli (Co-investigator and Advisor)"],
      journal: "Frontiers Public Health",
      date: "April 2026",
      type: "Peer-Reviewed",
      role: "Co-investigator and Advisor"
    },
    {
      id: "pub7",
      title: "Burnout among critical care nurses in tertiary-level hospitals of Nepal.",
      authors: ["Rahul Parajuli (First Author)"],
      journal: "JNHRC (Also Under Review at PLOS One)",
      date: "April 2026",
      type: "Under Review",
      role: "First Author"
    },
    {
      id: "pub8",
      title: "Knowledge, Attitude and Practice (KAP) of antimicrobial prescription, resistance and stewardship among clinical doctors in Nepal: A cross-sectional study.",
      authors: ["Rahul Parajuli (Co-investigator)"],
      journal: "BMC",
      date: "Pending publication",
      type: "Peer-Reviewed",
      role: "Co-investigator"
    },
    {
      id: "pub9",
      title: "A Surgical Case Series on Diagnosis and Intervention of Coronary artery anomalies: The Heart's Rare Blueprint.",
      authors: ["Rahul Parajuli (First Author)"],
      journal: "JNMA",
      date: "December 2025",
      type: "Under Review",
      role: "First Author"
    },
    {
      id: "pub10",
      title: "Medication errors in Intensive Care Unit: Assessment of Knowledge among Critical Care Nurses and implementation of a simple strategy to reduce errors.",
      authors: ["Rahul Parajuli (Co-investigator)"],
      journal: "medRxiv",
      date: "July 2025",
      doi: "10.1101/2025.07.07.25331001",
      type: "Preprint",
      role: "Co-investigator",
      link: "https://doi.org/10.1101/2025.07.07.25331001"
    },
    {
      id: "pub11",
      title: "Triple coinfection of Brucella abortus, scrub typhus, and Salmonella typhi in the subtropical region of Nepal: A rare case report.",
      authors: ["Rahul Parajuli (Co-Author)"],
      journal: "Cureus",
      date: "January 2025",
      doi: "10.21203/rs.3.rs-5790693/v1",
      type: "Preprint",
      role: "Co-Author",
      link: "https://doi.org/10.21203/rs.3.rs-5790693/v1"
    }
  ] as Publication[],
  skills: [
    {
      category: "Research Skills",
      items: [
        "Data Management & Analysis: IBM SPSS, REDCap, Data Cleaning, Metadata Management",
        "Regulatory Compliance: ICH-GCP, IRB/NHRC Proposal Submissions, HIPAA Compliance, Protocol Adherence",
        "Study Design: Multicentric Study Coordination, Retrospective Cohorts, Cross-sectional Studies, Case Series",
        "Medical Writing: Manuscript Drafting (ICMJE Format), Peer-Review Correspondence",
        "Systems: Epic and Meditech EMR, Microsoft Office 365"
      ]
    },
    {
      category: "Clinical Skills",
      items: [
        "Critical Care: Endotracheal Intubation, Mechanical Ventilation, Sepsis/Shock Management, End of Life Care",
        "Procedures: Central/Arterial/Dialysis Catheter Insertion, Pleural/Ascitic Fluid Tapping, Lumbar Puncture",
        "Diagnostics: Basic Point-of-Care Ultrasound (POCUS), Arterial Blood Gas (ABG) Interpretation",
        "Emergency Medicine: ACLS/BLS Lead Resuscitation, ATLS Multidisciplinary Coordination",
        "Infection Control & Barrier Precautions",
        "Organizing & Participating in Health Camps"
      ]
    }
  ] as SkillGroup[],
  volunteering: [
    {
      organization: "Mahanagar Autism Sewa Kendra",
      location: "Biratnagar, Nepal",
      date: "Apr 2, 2025 - May 26, 2025",
      responsibilities: [
        "Conducted regular health assessments and medical checkups for children with autism.",
        "Provided comprehensive support, counseling, and guidance to parents.",
        "Educated teachers, caregivers, and support staff on autism-related care and best practices.",
        "Established a digital record-keeping system to track developmental milestones.",
        "Actively participated in autism-related community programs and health camps.",
        "Assisted in the recruitment and evaluation of staff members for the center.",
        "Initiated research efforts related to autism within the local context."
      ]
    },
    {
      organization: "Cardiac Health Camp 2025",
      location: "Sindhupalchowk, Nepal",
      date: "Jun 8, 2024",
      responsibilities: [
        "Organized and conducted a one-day cardiac health camp with renowned cardiologists and surgeons. Screened 450 patients.",
        "Assisted in history-taking, risk assessment, and referral processes.",
        "Coordinated 250 echocardiographic examinations using portable ECHO machines.",
        "Emphasized early detection of cardiac abnormalities and congenital defects in rural communities."
      ]
    },
    {
      organization: "Maha Shivaratri Health Camp 2024",
      location: "Pashupatinath, Kathmandu, Nepal",
      date: "Mar 8, 2024",
      responsibilities: [
        "Doctor in charge on behalf of HAMS Hospital during a one-day medical camp.",
        "Collaborated with nurses and health assistants to provide care to pilgrims."
      ]
    }
  ] as VolunteerWork[],
  references: [
    {
      name: "Dr. Shravan Kooragayalu, MD, PCCM",
      title: "Medical Director, Pulmonary and Critical Care / Consultant and Intensivist",
      organization: "UPMC Western Maryland, Cumberland, USA",
      relationship: "USCE Clinical Preceptor (U.S. Clinical Observership)",
      email: "knsk86@gmail.com",
      phone: "+1 (516)761-6028"
    },
    {
      name: "Dr. Diptesh Aryal, MD, FACC (UHN, Canada)",
      title: "Executive Director",
      organization: "Nepal Intensive Care Research Foundation (NICRF), Nepal",
      relationship: "Principal Investigator / Research Supervisor",
      email: "diptesharyal@gmail.com"
    },
    {
      name: "Dr. Raju Pangeni, MD",
      title: "Head of Department of Pulmo, Critical Care, and Sleep Medicine",
      organization: "Hospital for Advanced Medicine and Surgery (HAMS), Kathmandu, Nepal",
      relationship: "Head of Department",
      email: ""
    },
    {
      name: "Dr. Sabin Koirala, MD, FACC (UHN, Canada)",
      title: "Medical Director, Consultant Intensivist",
      organization: "Hospital for Advanced Medicine and Surgery (HAMS), Nepal",
      relationship: "Clinical Supervisor (Critical Care Medicine)",
      email: "sabinkoirala@gmail.com / sabinkoirala@hamshospital.com",
      phone: "+977-9851135841"
    }
  ] as Reference[],
  certifications: [
    "ECFMG Certified (February 2025)",
    "POCUS Unplugged Workshop - BMCTH (November 2025)",
    "IBM SPSS - Udemy (November 2025)",
    "Fundamentals of Healthcare Communication - Udemy (August 2025)",
    "HIPAA Associate (HIPAAA) – HIPAA Training (October 2024)",
    "WHO Antimicrobial Stewardship (November 2024)",
    "OET Gold Standard (Medicine) (February 2024)",
    "Infection Control and Barrier Precaution - CEUfast (March 2024)",
    "ICH Good Clinical Practice E6 (R2) - The Global Health Network (July 2023)",
    "Health Research Methodology - NHRC & NICRF (September 2023)",
    "The Basic Assessment & Support in Intensive Care (BASIC) - The Chinese University of Hong Kong (December 2022)",
    "ACLS & BLS (March 2022)",
    "Nepal Medical Council License (January 2022)",
    "Bangladesh Medical and Dental Council (November 2021)"
  ],
  memberships: [
    "Member of American Medical Association - District of Columbia Chapter (Sep 2025 - Present)",
    "Member of American College of Physicians (ACP) (Jun 2023 - Present)",
    "Membership Associate - World Medical Association (WMA) (Dec 2024 - Present)",
    "Lifetime Member - Nepal Red Cross Society (Mar 2025 - Present)",
    "Member of Nepal-Bangladesh Medical Welfare Society (Apr 2019 - Present)"
  ]
};
