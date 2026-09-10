/**
 * CountUp Accounting — Bilingual Dictionary (EN / FR)
 * Centralized source of truth for all website content.
 */
const translations = {
    en: {
        meta: {
            title: "CountUp | Your Numbers. Our Precision.",
            description: "CountUp: Your Numbers. Our Precision. Expert accounting, personal tax, corporate tax, bookkeeping, and assurance services."
        },
        nav: {
            home: "Home",
            services: "Services",
            process: "How It Works",
            about: "About Us",
            faq: "FAQ",
            contact: "Contact",
            switchLang: "FR",
            switchLangAria: "Basculer vers le français",
            portal: "Client Portal"
        },
        hero: {
            title: "Your Numbers. Our Precision.",
            subtitle: "Comprehensive and stress-free accounting services for individuals and businesses. Optimize your finances with the experts at CountUp.",
            btnConsultation: "Schedule a Consultation",
            btnServices: "Explore Services",
            badgeSharefile: "ShareFile Encrypted",
            badgeCpa: "CPA Certified",
            badgeClients: "500+ Clients Satisfied"
        },
        banner: {
            prefix: "Success:",
            text: "We delivered maximum tax returns for over 500+ clients last year!"
        },
        services: {
            title: "Our Services",
            subtitle: "Comprehensive accounting and tax solutions tailored to your unique financial needs.",
            learnMore: "Learn More",
            personalTax: {
                title: "Personal Tax",
                desc: "Personal and self-employed tax return preparation, with careful attention to the deductions and credits that apply to your situation."
            },
            corporateTax: {
                title: "Corporate Tax",
                desc: "Corporate tax returns, tax planning, and compliance for businesses of all sizes."
            },
            bookkeeping: {
                title: "Bookkeeping",
                desc: "Full-cycle bookkeeping — transactions, bank reconciliations, and monthly financial statements — so your numbers are always up to date."
            },
            assurance: {
                title: "Assurance Services",
                desc: "Compilation, review, and audit engagements performed to professional standards, tailored to your business and its stakeholders."
            }
        },
        process: {
            title: "How It Works",
            subtitle: "A straightforward 4-step process for effortless accounting and tax preparation.",
            step1: {
                title: "Get in Touch",
                desc: "Contact us by phone, email, or through our website form to get started."
            },
            step2: {
                title: "Send Documents Securely",
                desc: "Upload your financial documents through our secure ShareFile portal, fully confidential."
            },
            step3: {
                title: "Preparation",
                desc: "Our expert team prepares your tax return or financial statements with meticulous care."
            },
            step4: {
                title: "Review & Delivery",
                desc: "We walk through everything with you before final submission and filing."
            }
        },
        taxSeason: {
            badge: "Important Information",
            title: "Tax Season: What You Need to Know",
            subtitle: "Ensure a smooth filing process by staying informed on key deadlines and required documents.",
            deadlinesTitle: "Key Deadlines",
            deadline1Date: "April 30:",
            deadline1Text: "Filing deadline for most individuals.",
            deadline2Date: "June 15:",
            deadline2Text: "Filing deadline for self-employed individuals and business income (any balance owing is still due April 30).",
            dropoffTitle: "No Appointment Needed",
            dropoffP1: "Current clients can drop off physical documents during business hours without an appointment.",
            dropoffP2Prefix: "Alternatively, securely upload your documents 24/7 via our ",
            dropoffPortalLink: "Secure Portal",
            dropoffP2Suffix: ".",
            docsTitle: "Documents to Prepare",
            tagSelfEmployed: "Self-Employed Income",
            tagRental: "Rental Income",
            tagMedical: "Medical Expenses",
            tagWorkFromHome: "Work from Home Expenses",
            tagSeparation: "Separation / Divorce",
            downloadBtn: "Download Tax Checklist (PDF)"
        },
        about: {
            title: "Why Choose CountUp?",
            subtitle: "We bring clarity to your finances with a personalized touch and CPA-backed expertise.",
            feat1Title: "Accuracy Guaranteed:",
            feat1Desc: "Meticulous attention to detail in every calculation.",
            feat2Title: "Timely Delivery:",
            feat2Desc: "Never miss a filing deadline again.",
            feat3Title: "Secure Portal:",
            feat3Desc: "Your financial documents are protected through our ShareFile platform, with bank-level encryption.",
            bio: "Our founder is a CPA with over 10 years of experience in tax and accounting, including 2 years at a Big Four firm. At CountUp, that expertise translates into a personalized, rigorous, and reliable service for both individuals and businesses.",
            cpaBadge: "CPA Member & Big Four Expertise",
            cardTitle: "Expert Financial Guidance",
            cardSubtitle: "Personalized & Rigorous Service"
        },
        faq: {
            title: "Frequently Asked Questions",
            subtitle: "Got questions? We're here to help clarify your tax and accounting inquiries.",
            q1: "What documents do I need for my tax return?",
            a1: "The full list is in the “Tax Season” section of our site. Generally: tax slips (T4, Relevé 1), donation receipts, medical expenses, and other documents relevant to your situation.",
            q2: "How does the client portal work?",
            a2: "Our secure ShareFile portal lets you send us your documents confidentially, from anywhere at your convenience.",
            q3: "Do you work with businesses and self-employed individuals?",
            a3: "Yes. Beyond personal tax returns, we support businesses with corporate tax, bookkeeping, and assurance engagements.",
            q4: "What's the difference between a compilation, review, and audit engagement?",
            a4: "These are three levels of assurance on your financial statements, from the simplest (compilation) to the most in-depth (audit). The right choice depends on your stakeholders' requirements — we can help you figure it out.",
            q5: "Do I need an appointment to meet with you?",
            a5: "No appointment is needed to drop off documents — but we're happy to schedule a consultation for specific questions."
        },
        contact: {
            title: "Get in Touch",
            subtitle: "Ready to maximize your tax returns or streamline your accounting? Reach out to us today.",
            visitUs: "Visit Us",
            callUs: "Call Us",
            emailUs: "Email Us",
            hours: "Business Hours",
            hoursVal: "Mon - Fri: 9:00 AM - 5:00 PM",
            formTitle: "Send us a Message",
            nameLabel: "Full Name",
            namePlaceholder: "John Doe",
            emailLabel: "Email Address",
            emailPlaceholder: "john@example.com",
            serviceLabel: "Interested Service",
            optPersonalTax: "Personal Tax",
            optCorporateTax: "Corporate Tax",
            optBookkeeping: "Bookkeeping",
            optAssurance: "Assurance / Certification",
            optOther: "Other Inquiry",
            msgLabel: "Message",
            msgPlaceholder: "How can we help you?",
            submitBtn: "Send Message",
            submitting: "Sending...",
            successMsg: "Thank you! Your message has been sent successfully. A CountUp representative will reach out shortly.",
            errorMsg: "There was a problem sending your message. Please call us at (438) 994-9140."
        },
        portalModal: {
            title: "Secure Portal",
            desc: "Securely access your financial documents through our ShareFile portal with bank-level encryption.",
            btnText: "Go to ShareFile",
            helpText: "Need help accessing your portal?",
            contactLink: "Contact Us"
        },
        checklistModal: {
            title: "Download Tax Checklist",
            desc: "Get our comprehensive checklist of required tax slips, deductions, and documentation.",
            emailLabel: "Email Address",
            emailPlaceholder: "your.name@example.com",
            downloadBtn: "Download PDF Checklist",
            successMsg: "Your checklist download has started! A copy has also been recorded."
        },
        footer: {
            tagline: "Your trusted partner for maximum tax returns and professional accounting.",
            quickLinks: "Quick Links",
            services: "Services",
            contactInfo: "Contact Info",
            rights: "© 2026 CountUp Accounting. All rights reserved."
        }
    },
    fr: {
        meta: {
            title: "CountUp | Vos chiffres. Notre rigueur.",
            description: "CountUp : Vos chiffres. Notre rigueur. Expertise en impôt des particuliers, impôt corporatif, tenue de livres et certification."
        },
        nav: {
            home: "Accueil",
            services: "Services",
            process: "Notre processus",
            about: "À propos",
            faq: "FAQ",
            contact: "Contact",
            switchLang: "EN",
            switchLangAria: "Switch to English",
            portal: "Portail client"
        },
        hero: {
            title: "Vos chiffres. Notre rigueur.",
            subtitle: "Des services comptables complets et sans tracas pour les particuliers et les entreprises. Optimisez vos finances avec les experts de CountUp.",
            btnConsultation: "Planifier une consultation",
            btnServices: "Explorer les services",
            badgeSharefile: "Chiffrement ShareFile",
            badgeCpa: "Membre CPA",
            badgeClients: "500+ Clients satisfaits"
        },
        banner: {
            prefix: "Succès :",
            text: "Nous avons maximisé les remboursements d'impôt de plus de 500 clients l'année dernière !"
        },
        services: {
            title: "Nos services",
            subtitle: "Des solutions comptables et fiscales adaptées à vos besoins spécifiques.",
            learnMore: "En savoir plus",
            personalTax: {
                title: "Impôt des particuliers",
                desc: "Préparation de déclarations de revenus pour particuliers et travailleurs autonomes, avec une attention particulière aux déductions et crédits applicables à votre situation."
            },
            corporateTax: {
                title: "Impôt corporatif",
                desc: "Déclarations de revenus des sociétés, planification fiscale et conformité pour les entreprises de toutes tailles."
            },
            bookkeeping: {
                title: "Tenue de livres",
                desc: "Tenue de livres complète — transactions, conciliations bancaires et états financiers mensuels — pour que vos chiffres soient toujours à jour."
            },
            assurance: {
                title: "Certification",
                desc: "Missions de compilation, d'examen et d'audit réalisées selon les normes professionnelles, adaptées aux besoins de votre entreprise et de ses parties prenantes."
            }
        },
        process: {
            title: "Notre processus",
            subtitle: "Un processus simple en 4 étapes pour une gestion comptable et fiscale en toute sérénité.",
            step1: {
                title: "Prise de contact",
                desc: "Vous nous joignez par téléphone, courriel ou via le formulaire du site."
            },
            step2: {
                title: "Envoi sécurisé des documents",
                desc: "Vous téléversez vos documents via notre portail ShareFile, en toute confidentialité."
            },
            step3: {
                title: "Préparation",
                desc: "Notre équipe prépare votre déclaration ou vos états financiers avec rigueur."
            },
            step4: {
                title: "Révision et livraison",
                desc: "On révise le tout avec vous avant la transmission finale."
            }
        },
        taxSeason: {
            badge: "Information importante",
            title: "Saison des impôts : Ce que vous devez savoir",
            subtitle: "Assurez-vous d'un processus de déclaration fluide en restant informé des dates limites clés et des documents requis.",
            deadlinesTitle: "Dates limites importantes",
            deadline1Date: "30 avril :",
            deadline1Text: "Date limite pour la majorité des particuliers.",
            deadline2Date: "15 juin :",
            deadline2Text: "Date limite pour les travailleurs autonomes et les revenus d'entreprise (le solde dû reste exigible le 30 avril).",
            dropoffTitle: "Sans rendez-vous",
            dropoffP1: "Ceci s'adresse à nos clients actuels. Vous n’avez pas besoin de rendez-vous pour venir porter vos documents en main propre pendant nos heures d’ouverture.",
            dropoffP2Prefix: "Vous pouvez également déposer vos documents en toute sécurité via notre ",
            dropoffPortalLink: "Portail Sécurisé",
            dropoffP2Suffix: ".",
            docsTitle: "Documents à préparer",
            tagSelfEmployed: "Travailleurs autonomes",
            tagRental: "Revenus locatifs",
            tagMedical: "Frais médicaux",
            tagWorkFromHome: "Frais de bureau à domicile",
            tagSeparation: "Séparation / divorce",
            downloadBtn: "Télécharger la liste de vérification (PDF)"
        },
        about: {
            title: "Pourquoi choisir CountUp ?",
            subtitle: "Nous apportons de la clarté à vos finances avec une touche personnalisée et une expertise reconnue.",
            feat1Title: "Précision garantie :",
            feat1Desc: "Une attention méticuleuse portée aux détails dans chaque calcul.",
            feat2Title: "Livraison dans les délais :",
            feat2Desc: "Ne manquez plus jamais une date limite de déclaration.",
            feat3Title: "Portail sécurisé :",
            feat3Desc: "Vos documents financiers sont protégés grâce à notre plateforme ShareFile, avec chiffrement de niveau bancaire.",
            bio: "Notre fondateur est CPA et cumule plus de 10 ans d'expérience en fiscalité et en comptabilité, dont 2 ans au sein d'un cabinet Big Four. Chez CountUp, cette expertise se traduit par un service personnalisé, rigoureux et fiable, autant pour les particuliers que pour les entreprises.",
            cpaBadge: "Membre CPA & Expertise Big Four",
            cardTitle: "Stratégie financière experte",
            cardSubtitle: "Service personnalisé et rigoureux"
        },
        faq: {
            title: "Foire Aux Questions",
            subtitle: "Des questions ? Nous sommes là pour vous éclairer sur vos démarches comptables et fiscales.",
            q1: "Quels documents dois-je fournir pour ma déclaration de revenus ?",
            a1: "La liste complète est disponible dans la section « Saison des impôts » de notre site. En général : feuillets fiscaux (T4, Relevé 1), reçus de dons, frais médicaux et autres pièces pertinentes à votre situation.",
            q2: "Comment fonctionne le portail client ?",
            a2: "Notre portail sécurisé ShareFile vous permet de nous transmettre vos documents en toute confidentialité, où que vous soyez.",
            q3: "Offrez-vous des services aux entreprises et aux travailleurs autonomes ?",
            a3: "Oui. En plus des déclarations pour particuliers, nous accompagnons les entreprises en fiscalité corporative, tenue de livres et missions de certification.",
            q4: "Quelle est la différence entre une mission de compilation, d'examen et d'audit ?",
            a4: "Ce sont trois niveaux d'assurance sur vos états financiers, du plus simple (compilation) au plus approfondi (audit). Le bon choix dépend des exigences de vos parties prenantes — on peut en discuter ensemble.",
            q5: "Dois-je prendre rendez-vous pour vous rencontrer ?",
            a5: "Non, aucun rendez-vous n'est nécessaire pour déposer vos documents — mais nous sommes disponibles pour une consultation si vous avez des questions particulières."
        },
        contact: {
            title: "Contactez-nous",
            subtitle: "Prêt à maximiser vos retours d'impôt ou à simplifier votre comptabilité ? Contactez-nous dès aujourd'hui.",
            visitUs: "Visitez-nous",
            callUs: "Appelez-nous",
            emailUs: "Envoyez-nous un courriel",
            hours: "Heures d'ouverture",
            hoursVal: "Lun - Ven : 9h00 - 17h00",
            formTitle: "Envoyez-nous un message",
            nameLabel: "Nom complet",
            namePlaceholder: "Jean Dupont",
            emailLabel: "Adresse courriel",
            emailPlaceholder: "jean@exemple.com",
            serviceLabel: "Service désiré",
            optPersonalTax: "Impôt des particuliers",
            optCorporateTax: "Impôt corporatif",
            optBookkeeping: "Tenue de livres",
            optAssurance: "Certification / Assurance",
            optOther: "Autre demande",
            msgLabel: "Message",
            msgPlaceholder: "Comment pouvons-nous vous aider ?",
            submitBtn: "Envoyer le message",
            submitting: "Envoi en cours...",
            successMsg: "Merci ! Votre message a été envoyé avec succès. Un représentant de CountUp vous contactera sous peu.",
            errorMsg: "Une erreur est survenue lors de l'envoi de votre message. Veuillez nous appeler au (438) 994-9140."
        },
        portalModal: {
            title: "Portail sécurisé",
            desc: "Accédez à vos documents financiers en toute sécurité via notre portail ShareFile avec chiffrement de niveau bancaire.",
            btnText: "Accéder à ShareFile",
            helpText: "Besoin d'aide pour accéder à votre portail ?",
            contactLink: "Contactez-nous"
        },
        checklistModal: {
            title: "Télécharger la liste de vérification",
            desc: "Obtenez notre liste complète des feuillets fiscaux, déductions et documents nécessaires.",
            emailLabel: "Adresse courriel",
            emailPlaceholder: "votre.nom@exemple.com",
            downloadBtn: "Télécharger la liste (PDF)",
            successMsg: "Votre téléchargement a commencé ! Une copie a également été enregistrée."
        },
        footer: {
            tagline: "Votre partenaire de confiance pour des retours d'impôts maximaux et une comptabilité professionnelle.",
            quickLinks: "Liens rapides",
            services: "Services",
            contactInfo: "Coordonnées",
            rights: "© 2026 CountUp Comptabilité. Tous droits réservés."
        }
    }
};

// Helper function to resolve nested keys like "hero.title"
function getTranslation(lang, path) {
    const keys = path.split('.');
    let current = translations[lang] || translations.en;
    for (const key of keys) {
        if (current && current[key] !== undefined) {
            current = current[key];
        } else {
            return undefined;
        }
    }
    return current;
}

// Attach to window if in browser environment for vanilla script access
if (typeof window !== 'undefined') {
    window.CountUpTranslations = translations;
    window.getCountUpTranslation = getTranslation;
}



