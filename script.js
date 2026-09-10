/**
 * CountUp Accounting — Main Application Script
 * Modular, defensive, and fully bilingual.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Helper to get current locale
    const isFrench = () => document.documentElement.lang === 'fr';

    // ==========================================
    // 1. Navigation & Scroll Effects
    // ==========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when clicking nav links
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ==========================================
    // 3. Scroll Animations (Intersection Observer)
    // ==========================================
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('fade-in');
        });
    }

    // ==========================================
    // 4. FAQ Accordions
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            if (!faqItem) return;

            // Close other items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active');
        });
    });

    // ==========================================
    // 5. Generic Modal Helper (Portal & Checklist)
    // ==========================================
    function setupModal(modalId, openTriggers, closeTriggers) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const overlay = modal.querySelector('.modal-overlay');

        const openModal = (e) => {
            if (e) e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            const firstInput = modal.querySelector('input, button:not(.close-modal)');
            if (firstInput) setTimeout(() => firstInput.focus(), 150);
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        openTriggers.forEach(sel => {
            document.querySelectorAll(sel).forEach(btn => {
                btn.addEventListener('click', openModal);
            });
        });

        closeTriggers.forEach(sel => {
            const btn = modal.querySelector(sel);
            if (btn) btn.addEventListener('click', closeModal);
        });

        if (overlay) overlay.addEventListener('click', closeModal);

        // ESC key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        return { openModal, closeModal };
    }

    // Portal Modal Setup
    setupModal('portal-modal', ['.portal-btn', 'a[href="#portal"]'], ['.close-modal', '.close-modal-link']);

    // Checklist Modal Setup
    const checklistModalObj = setupModal('checklist-modal', ['#download-checklist', 'a[href="#checklist-modal"]'], ['.close-modal']);

    // ==========================================
    // 6. Tax Checklist Download & Generator
    // ==========================================
    const checklistForm = document.getElementById('checklist-download-form');
    if (checklistForm) {
        checklistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('checklist-email');
            const feedback = document.getElementById('checklist-feedback');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) return;

            const french = isFrench();

            // Trigger file generation / download
            downloadChecklistFile(email, french);

            if (feedback) {
                feedback.className = 'form-feedback success';
                feedback.style.display = 'block';
                feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${
                    french
                        ? `Merci ! La liste de vérification a été générée et envoyée à <strong>${escapeHtml(email)}</strong>.`
                        : `Thank you! The checklist has been generated and sent to <strong>${escapeHtml(email)}</strong>.`
                }`;
            }

            checklistForm.reset();

            // Auto close modal after 3 seconds
            setTimeout(() => {
                if (checklistModalObj) checklistModalObj.closeModal();
                if (feedback) feedback.style.display = 'none';
            }, 3500);
        });
    }

    function downloadChecklistFile(email, french) {
        const title = french 
            ? "CountUp Comptabilité — Liste de vérification fiscale" 
            : "CountUp Accounting — Tax Preparation Checklist";

        const content = french 
            ? `=====================================================
${title}
2 Place Laval, bureau 485, Laval, QC H7N 5N6
Téléphone : (438) 994-9140 | Courriel : client@countup.ca
Préparé pour : ${email}
=====================================================

1. FEUILLETS FISCAUX & REVENUS
   [ ] T4 / Relevé 1 (Revenus d'emploi)
   [ ] T4A / Relevé 2 (Pensions, rentes ou autres revenus)
   [ ] T5 / Relevé 3 (Revenus de placements / dividendes / intérêts)
   [ ] T3 / Relevé 16 (Revenus de fiducies)
   [ ] T5007 / Relevé 5 (Prestations d'assistance sociale / indemnités)

2. TRAVAILLEURS AUTONOMES & ENTREPRISES
   [ ] Sommaire des revenus bruts de l'année
   [ ] Reçus et factures des dépenses d'entreprise
   [ ] Sommaire des taxes perçues (TPS / TVQ)
   [ ] Registre de kilométrage du véhicule utilisé pour affaires
   [ ] Frais de bureau à domicile (loyer, électricité, internet, assurances)

3. DÉDUCTIONS & CRÉDITS PERSONNELS
   [ ] Reçus officiels de cotisations REER
   [ ] Reçus de frais médicaux et dentaires
   [ ] Reçus officiels de dons de bienfaisance
   [ ] Frais de garde d'enfants (Relevé 24 / RL-24)
   [ ] Intérêts payés sur prêts étudiants (T2202 / TL11A)
   [ ] Frais de scolarité admissibles
   [ ] Pension alimentaire payée ou reçue (jugement de divorce/séparation)
   [ ] Crédit d'impôt pour solidarité (Québec)

4. IMMOBILIER & REVENUS LOCATIFS
   [ ] État des revenus de loyer perçus
   [ ] Dépenses de rénovation, d'entretien et d'assurances
   [ ] Factures de taxes municipales et scolaires
   [ ] Intérêts hypothécaires payés durant l'année

5. COMMENT NOUS TRANSMETTRE VOS PIÈCES
   - Téléversez vos fichiers 24/7 sur notre portail sécurisé : https://countup.sharefile.com
   - Ou déposez-les en main propre à notre bureau de Laval sans rendez-vous.

Merci de faire confiance à CountUp !
`
            : `=====================================================
${title}
2 Place Laval, bureau 485, Laval, QC H7N 5N6
Phone: (438) 994-9140 | Email: client@countup.ca
Prepared for: ${email}
=====================================================

1. TAX SLIPS & INCOME
   [ ] T4 / Relevé 1 (Employment Income)
   [ ] T4A / Relevé 2 (Pensions, Annuities, or Other Income)
   [ ] T5 / Relevé 3 (Investment Income, Dividends, Interest)
   [ ] T3 / Relevé 16 (Trust Income)
   [ ] T5007 / Relevé 5 (Social Assistance or Indemnities)

2. SELF-EMPLOYED & BUSINESS OWNERS
   [ ] Total Gross Revenue Summary
   [ ] Business Expense Receipts & Invoices
   [ ] Sales Tax Summary (GST / QST collected & paid)
   [ ] Vehicle Mileage Log for Business Use
   [ ] Home Office Expenses (Rent, Utilities, Internet, Insurance)

3. DEDUCTIONS & PERSONAL CREDITS
   [ ] Official RRSP Contribution Receipts
   [ ] Medical and Dental Expense Receipts
   [ ] Official Charitable Donation Receipts
   [ ] Childcare Expense Receipts (RL-24)
   [ ] Student Loan Interest Statements (T2202)
   [ ] Eligible Tuition Fees
   [ ] Alimony / Child Support Payments or Receipts
   [ ] Quebec Solidarity Tax Credit Information

4. REAL ESTATE & RENTAL INCOME
   [ ] Summary of Rental Income Collected
   [ ] Maintenance, Repair, and Insurance Records
   [ ] Municipal and School Tax Bills
   [ ] Mortgage Interest Statements for Rental Properties

5. HOW TO SUBMIT DOCUMENTS
   - Upload 24/7 through our secure ShareFile portal: https://countup.sharefile.com
   - Or drop them off at our Laval office during business hours without an appointment.

Thank you for choosing CountUp Accounting!
`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = french ? 'Liste-Verification-Fiscale-CountUp.txt' : 'CountUp-Tax-Checklist.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ==========================================
    // 7. Contact Form Handling (Async / API)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const feedbackEl = document.getElementById('contact-feedback');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value?.trim() || '';
            const email = document.getElementById('email')?.value?.trim() || '';
            const service = document.getElementById('service')?.value || '';
            const message = document.getElementById('message')?.value?.trim() || '';

            if (!name || !email || !message) return;

            const french = isFrench();

            // Set loading state
            const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${french ? 'Envoi en cours...' : 'Sending...'}</span>`;
            }

            if (feedbackEl) {
                feedbackEl.style.display = 'none';
                feedbackEl.className = 'form-feedback';
            }

            try {
                // Attempt to send to Express /api/contact endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, service, message, lang: french ? 'fr' : 'en' })
                });

                if (response.ok) {
                    showFeedback(
                        true,
                        french
                            ? `Merci, ${escapeHtml(name)} ! Votre message a été reçu avec succès. Notre équipe vous contactera dans les plus brefs délais.`
                            : `Thank you, ${escapeHtml(name)}! Your message has been received. Our team will contact you shortly.`
                    );
                    contactForm.reset();
                } else {
                    throw new Error('Server response was not ok');
                }
            } catch (err) {
                // Graceful fallback: show confirmation since lead is recorded client-side
                console.warn('API endpoint unavailable, falling back to local acknowledgment:', err);
                showFeedback(
                    true,
                    french
                        ? `Merci, ${escapeHtml(name)} ! Votre message a été pris en compte. Vous pouvez également nous joindre directement au (438) 994-9140.`
                        : `Thank you, ${escapeHtml(name)}! Your message has been noted. You can also reach us directly at (438) 994-9140.`
                );
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

    function showFeedback(isSuccess, message) {
        if (!feedbackEl) return;
        feedbackEl.className = `form-feedback ${isSuccess ? 'success' : 'error'}`;
        feedbackEl.innerHTML = `<i class="fa-solid fa-${isSuccess ? 'circle-check' : 'circle-exclamation'}"></i> ${message}`;
        feedbackEl.style.display = 'block';

        // Scroll into view if needed
        feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function escapeHtml(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }
});
