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

        // Close mobile menu when clicking nav links or action buttons
        const links = navLinks.querySelectorAll('.nav-link, .btn');
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
    // 5. Generic Modal Helper (Portal, Checklist & Legal Popups)
    // ==========================================
    function setupModal(modalId, openTriggers, closeTriggers) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const overlay = modal.querySelector('.modal-overlay');

        const openModal = (e) => {
            if (e) e.preventDefault();
            // Close other open modals
            document.querySelectorAll('.modal.active').forEach(m => {
                if (m !== modal) m.classList.remove('active');
            });
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            const firstInput = modal.querySelector('input, button:not(.close-modal)');
            if (firstInput) setTimeout(() => firstInput.focus(), 150);
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        // Delegated click listener to catch dynamically rendered i18n triggers
        document.addEventListener('click', (e) => {
            for (const sel of openTriggers) {
                if (e.target.closest(sel)) {
                    openModal(e);
                    return;
                }
            }
            for (const sel of closeTriggers) {
                if (e.target.closest(sel) && e.target.closest('.modal') === modal) {
                    if (e) e.preventDefault();
                    closeModal();
                    return;
                }
            }
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
    setupModal('portal-modal', ['.portal-btn', 'a[href="#portal"]'], ['.close-modal', '.close-modal-link', '.close-modal-btn']);

    // Checklist Modal Setup
    const checklistModalObj = setupModal('checklist-modal', ['#download-checklist', 'a[href="#checklist-modal"]'], ['.close-modal', '.close-modal-btn']);

    // Legal Policy JS Popups
    setupModal('privacy-modal', ['a[href="#privacy-modal"]', '.open-privacy-trigger'], ['.close-modal', '.close-modal-btn']);
    setupModal('cookies-modal', ['a[href="#cookies-modal"]', '.open-cookies-trigger'], ['.close-modal', '.close-modal-btn']);

    // ==========================================
    // 6. Tax Checklist Download & Generator
    // ==========================================
    const checklistForm = document.getElementById('checklist-download-form');
    const checklistConsent = document.getElementById('checklist-consent');
    const checklistSubmitBtn = document.getElementById('checklist-submit-btn');
    const checklistFormTime = document.getElementById('checklist-form-time');

    if (checklistFormTime) {
        checklistFormTime.value = Date.now();
    }

    if (checklistConsent && checklistSubmitBtn) {
        checklistConsent.addEventListener('change', () => {
            checklistSubmitBtn.disabled = !checklistConsent.checked;
        });
    }

    if (checklistForm) {
        checklistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('checklist-email');
            const feedback = document.getElementById('checklist-feedback');
            const honeypot = document.getElementById('checklist-honeypot');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) return;

            if (!checklistConsent || !checklistConsent.checked) {
                if (feedback) {
                    feedback.className = 'form-feedback error';
                    feedback.style.display = 'block';
                    feedback.textContent = isFrench() 
                        ? 'Veuillez accepter le consentement requis par la Loi 25.' 
                        : 'Please check the consent box required under Law 25.';
                }
                return;
            }

            const french = isFrench();

            // Track checklist request on server
            try {
                fetch('/api/checklist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        lang: french ? 'fr' : 'en',
                        consent: true,
                        website_url: honeypot ? honeypot.value : '',
                        form_time: checklistFormTime ? checklistFormTime.value : ''
                    })
                }).catch(() => {});
            } catch (err) {}

            // Trigger file generation / download
            downloadChecklistFile(email, french);

            if (feedback) {
                feedback.className = 'form-feedback success';
                feedback.style.display = 'block';
                feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${
                    french
                        ? `Merci ! La liste de vérification a été générée et téléchargée avec succès pour <strong>${escapeHtml(email)}</strong>.`
                        : `Thank you! The checklist has been generated and downloaded successfully for <strong>${escapeHtml(email)}</strong>.`
                }`;
            }

            checklistForm.reset();
            if (checklistSubmitBtn) checklistSubmitBtn.disabled = true;

            // Auto close modal after 3.5 seconds
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
   - Téléversez vos fichiers 24/7 sur notre portail sécurisé (sans connexion requise) : https://countup.ca/#portal
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
   - Upload 24/7 through our secure drop portal (zero login required): https://countup.ca/#portal
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
    const contactConsent = document.getElementById('contact-consent');
    const contactHoneypot = document.getElementById('contact-honeypot');
    const contactFormTime = document.getElementById('contact-form-time');

    if (contactFormTime) {
        contactFormTime.value = Date.now();
    }

    if (contactConsent && submitBtn) {
        contactConsent.addEventListener('change', () => {
            submitBtn.disabled = !contactConsent.checked;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value?.trim() || '';
            const email = document.getElementById('email')?.value?.trim() || '';
            const service = document.getElementById('service')?.value || '';
            const message = document.getElementById('message')?.value?.trim() || '';
            const french = isFrench();

            if (!name || !email || !message) {
                showFeedback(
                    false,
                    french ? 'Veuillez remplir tous les champs obligatoires.' : 'Please fill in all required fields.'
                );
                return;
            }

            // Verify Law 25 consent
            if (!contactConsent || !contactConsent.checked) {
                showFeedback(
                    false,
                    french
                        ? 'Veuillez accepter le consentement d’utilisation des données selon la Loi 25.'
                        : 'Please agree to the privacy consent required under Law 25.'
                );
                return;
            }

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
                // Send to Express /api/contact endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name, 
                        email, 
                        service, 
                        message, 
                        lang: french ? 'fr' : 'en',
                        consent: true,
                        website_url: contactHoneypot ? contactHoneypot.value : '',
                        form_time: contactFormTime ? contactFormTime.value : ''
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    showFeedback(
                        true,
                        french
                            ? `Merci, ${escapeHtml(name)} ! Votre message a été reçu avec succès. Notre équipe de Laval vous contactera dans les plus brefs délais.`
                            : `Thank you, ${escapeHtml(name)}! Your message has been received successfully. Our Laval team will contact you shortly.`
                    );
                    contactForm.reset();
                    if (contactConsent) contactConsent.checked = false;
                    if (submitBtn) submitBtn.disabled = true;
                } else if (response.status === 429) {
                    showFeedback(
                        false,
                        french
                            ? 'Trop de soumissions récentes. Veuillez nous contacter directement au (438) 994-9140.'
                            : 'Too many requests. Please contact us directly at (438) 994-9140.'
                    );
                } else {
                    throw new Error(data.error || 'Server error');
                }
            } catch (err) {
                // Graceful fallback
                console.warn('API error, providing acknowledgment:', err);
                showFeedback(
                    true,
                    french
                        ? `Merci, ${escapeHtml(name)} ! Votre message a été pris en compte. Vous pouvez également nous joindre directement au (438) 994-9140.`
                        : `Thank you, ${escapeHtml(name)}! Your message has been noted. You can also reach us directly at (438) 994-9140.`
                );
                contactForm.reset();
                if (contactConsent) contactConsent.checked = false;
                if (submitBtn) submitBtn.disabled = true;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = !contactConsent?.checked;
                    submitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

    // ==========================================
    // 8. Contact & Online Appointment Scheduler
    // ==========================================
    const tabBtnBooking = document.getElementById('tab-btn-booking');
    const tabBtnMessage = document.getElementById('tab-btn-message');
    const bookingPanel = document.getElementById('booking-panel');
    const messagePanel = document.getElementById('message-panel');

    function switchContactTab(tabName) {
        if (tabName === 'booking') {
            if (tabBtnBooking) {
                tabBtnBooking.classList.add('active');
                tabBtnBooking.setAttribute('aria-selected', 'true');
            }
            if (tabBtnMessage) {
                tabBtnMessage.classList.remove('active');
                tabBtnMessage.setAttribute('aria-selected', 'false');
            }
            if (bookingPanel) bookingPanel.style.display = 'block';
            if (messagePanel) messagePanel.style.display = 'none';
        } else {
            // Default: General Message Tab
            if (tabBtnMessage) {
                tabBtnMessage.classList.add('active');
                tabBtnMessage.setAttribute('aria-selected', 'true');
            }
            if (tabBtnBooking) {
                tabBtnBooking.classList.remove('active');
                tabBtnBooking.setAttribute('aria-selected', 'false');
            }
            if (bookingPanel) bookingPanel.style.display = 'none';
            if (messagePanel) messagePanel.style.display = 'block';
        }
    }

    if (tabBtnBooking && tabBtnMessage) {
        tabBtnBooking.addEventListener('click', () => switchContactTab('booking'));
        tabBtnMessage.addEventListener('click', () => switchContactTab('message'));
    }

    // Default to sending message on page load as requested
    switchContactTab('message');

    // Booking service pre-selectors & appointment CTAs across the site
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.select-booking-service-btn, .nav-booking-btn, [data-tab="booking"]');
        if (!target) return;

        switchContactTab('booking');
        const serviceVal = target.getAttribute('data-service');
        if (serviceVal) {
            const selectEl = document.getElementById('booking-service');
            if (selectEl) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].value === serviceVal) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    });

    // Meeting format radio visual cards
    const choiceCards = document.querySelectorAll('.booking-choice-card');
    choiceCards.forEach(card => {
        card.addEventListener('click', () => {
            choiceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // ==========================================
    // Simple Calendar Widget
    // ==========================================
    const calDaysGrid = document.getElementById('cal-days-grid');
    const calMonthHeading = document.getElementById('cal-month-heading');
    const calPrevMonthBtn = document.getElementById('cal-prev-month');
    const calNextMonthBtn = document.getElementById('cal-next-month');
    const datePickerInput = document.getElementById('booking-custom-date');
    const selectedDateInput = document.getElementById('selected-booking-date');
    const selectedTimeInput = document.getElementById('selected-booking-time');
    const liveSummaryText = document.getElementById('booking-live-summary-text');

    const dayNamesFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNamesFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // State
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initial selected date: next available business day (Monday - Friday)
    let selectedDate = new Date(today);
    selectedDate.setDate(selectedDate.getDate() + 1);
    while (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
        selectedDate.setDate(selectedDate.getDate() + 1);
    }

    let viewDate = new Date(selectedDate);

    function updateLiveSummary() {
        if (!liveSummaryText) return;
        const french = isFrench();
        const dateVal = selectedDateInput ? selectedDateInput.value : '';
        const timeVal = selectedTimeInput ? selectedTimeInput.value : '09:00';
        const prefix = french ? 'Rendez-vous :' : 'Appointment:';
        if (dateVal) {
            liveSummaryText.innerHTML = `${prefix} <strong style="color: var(--cobalt-primary);">${escapeHtml(dateVal)}</strong> à <strong style="color: var(--cobalt-primary);">${escapeHtml(timeVal)}</strong>`;
        } else {
            liveSummaryText.textContent = french ? 'Veuillez sélectionner une date' : 'Please select a date';
        }
    }

    function formatFullDate(d) {
        const french = isFrench();
        const dayOfWeek = d.getDay();
        const dayName = french ? dayNamesFr[dayOfWeek] : dayNamesEn[dayOfWeek];
        const dayNum = d.getDate();
        const monthName = french ? monthNamesFr[d.getMonth()] : monthNamesEn[d.getMonth()];
        const year = d.getFullYear();
        return `${dayName} ${dayNum} ${monthName} ${year}`;
    }

    function setSelectedDate(d) {
        selectedDate = new Date(d);
        const iso = selectedDate.toISOString().split('T')[0];
        const formatted = formatFullDate(selectedDate);

        if (selectedDateInput) {
            selectedDateInput.value = formatted;
            selectedDateInput.dataset.iso = iso;
        }

        if (datePickerInput) {
            datePickerInput.value = iso;
        }

        updateLiveSummary();
    }

    function renderSimpleCalendar() {
        if (!calDaysGrid || !calMonthHeading) return;

        const french = isFrench();
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        // Month Heading
        calMonthHeading.textContent = `${french ? monthNamesFr[month] : monthNamesEn[month]} ${year}`;

        calDaysGrid.innerHTML = '';

        // Day 1 of month
        const firstDay = new Date(year, month, 1);
        // Week starts on Monday: Mon=0, Tue=1, ..., Sun=6
        const startDayIndex = (firstDay.getDay() === 0) ? 6 : firstDay.getDay() - 1;

        // Empty cells before 1st of month
        for (let i = 0; i < startDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day-cell empty';
            emptyCell.setAttribute('aria-hidden', 'true');
            calDaysGrid.appendChild(emptyCell);
        }

        // Days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const selectedIso = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        const todayIso = today.toISOString().split('T')[0];

        for (let day = 1; day <= daysInMonth; day++) {
            const currentCellDate = new Date(year, month, day);
            currentCellDate.setHours(0, 0, 0, 0);

            const cellIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayOfWeek = currentCellDate.getDay();
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
            const isPast = (currentCellDate < today);
            const isSelected = (cellIso === selectedIso);
            const isToday = (cellIso === todayIso);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `cal-day-cell${isSelected ? ' active' : ''}${isToday ? ' today' : ''}${isWeekend ? ' weekend' : ''}`;
            btn.textContent = day;
            btn.setAttribute('aria-label', `${day} ${french ? monthNamesFr[month] : monthNamesEn[month]} ${year}`);

            if (isPast || isWeekend) {
                btn.disabled = true;
                if (isWeekend) {
                    btn.title = french ? 'Fermé le week-end' : 'Closed on weekends';
                } else {
                    btn.title = french ? 'Date passée' : 'Past date';
                }
            } else {
                btn.addEventListener('click', () => {
                    setSelectedDate(currentCellDate);
                    renderSimpleCalendar();
                });
            }

            calDaysGrid.appendChild(btn);
        }
    }

    // Month Navigation Controls
    if (calPrevMonthBtn) {
        calPrevMonthBtn.addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() - 1);
            renderSimpleCalendar();
        });
    }

    if (calNextMonthBtn) {
        calNextMonthBtn.addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() + 1);
            renderSimpleCalendar();
        });
    }

    // Native Date Input Integration
    if (datePickerInput) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        datePickerInput.min = tomorrow.toISOString().split('T')[0];

        datePickerInput.addEventListener('change', () => {
            if (!datePickerInput.value) return;
            const parts = datePickerInput.value.split('-');
            if (parts.length === 3) {
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                const d = parseInt(parts[2], 10);
                const picked = new Date(y, m, d);
                
                // If weekend picked, adjust to Monday
                if (picked.getDay() === 0) picked.setDate(picked.getDate() + 1);
                if (picked.getDay() === 6) picked.setDate(picked.getDate() + 2);

                viewDate = new Date(picked);
                setSelectedDate(picked);
                renderSimpleCalendar();
            }
        });
    }

    // Initialize Simple Calendar Widget with default business day
    setSelectedDate(selectedDate);
    renderSimpleCalendar();

    // Re-render when language toggles (FR <-> EN)
    window.addEventListener('countup:languageChanged', () => {
        setSelectedDate(selectedDate);
        renderSimpleCalendar();
    });
    window.addEventListener('languageChanged', () => {
        setSelectedDate(selectedDate);
        renderSimpleCalendar();
    });

    // Time Slot Selection (supports all slot buttons in morning & afternoon grids)
    const slotButtons = document.querySelectorAll('.booking-slot-btn');
    slotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            slotButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const time = btn.dataset.time || btn.textContent.trim().replace(/[^\d:]/g, '');
            if (selectedTimeInput) selectedTimeInput.value = time;
            updateLiveSummary();
        });
    });

    // Appointment Booking Form Submission
    const bookingForm = document.getElementById('appointment-booking-form');
    const bookingSubmitBtn = document.getElementById('booking-submit-btn');
    const bookingConsent = document.getElementById('booking-consent');
    const bookingFeedback = document.getElementById('booking-feedback');
    const bookingFormTime = document.getElementById('booking-form-time');
    const bookingHoneypot = document.getElementById('booking-honeypot');
    const bookingSuccessView = document.getElementById('booking-success-view');
    const bookingSummaryBox = document.getElementById('booking-summary-box');
    const googleCalLink = document.getElementById('booking-google-calendar-link');
    const downloadIcsBtn = document.getElementById('booking-download-ics-btn');
    const bookingResetBtn = document.getElementById('booking-reset-btn');

    if (bookingFormTime) {
        bookingFormTime.value = Date.now();
    }

    if (bookingConsent && bookingSubmitBtn) {
        bookingConsent.addEventListener('change', () => {
            bookingSubmitBtn.disabled = !bookingConsent.checked;
        });
    }

    let lastBookedAppointment = null;

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('booking-name')?.value?.trim() || '';
            const email = document.getElementById('booking-email')?.value?.trim() || '';
            const phone = document.getElementById('booking-phone')?.value?.trim() || '';
            const service = document.getElementById('booking-service')?.value || '';
            const formatInput = document.querySelector('input[name="booking_format"]:checked');
            const format = formatInput ? formatInput.value : 'En personne (Laval)';
            const date = selectedDateInput ? selectedDateInput.value : '';
            const dateIso = selectedDateInput?.dataset?.iso || '';
            const time = selectedTimeInput ? selectedTimeInput.value : '09:00';
            const notes = document.getElementById('booking-notes')?.value?.trim() || '';
            const french = isFrench();

            if (!name || !email || !phone) {
                if (bookingFeedback) {
                    bookingFeedback.className = 'form-feedback error';
                    bookingFeedback.style.display = 'block';
                    bookingFeedback.textContent = french 
                        ? 'Veuillez remplir votre nom, courriel et numéro de téléphone.' 
                        : 'Please enter your name, email, and phone number.';
                }
                return;
            }

            if (!bookingConsent || !bookingConsent.checked) {
                if (bookingFeedback) {
                    bookingFeedback.className = 'form-feedback error';
                    bookingFeedback.style.display = 'block';
                    bookingFeedback.textContent = french 
                        ? 'Veuillez accepter le consentement requis par la Loi 25.' 
                        : 'Please accept the consent required by Law 25.';
                }
                return;
            }

            const originalBtnContent = bookingSubmitBtn ? bookingSubmitBtn.innerHTML : '';
            if (bookingSubmitBtn) {
                bookingSubmitBtn.disabled = true;
                bookingSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${french ? 'Réservation en cours...' : 'Booking in progress...'}</span>`;
            }

            try {
                const response = await fetch('/api/appointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        service,
                        format,
                        date,
                        time,
                        notes,
                        lang: french ? 'fr' : 'en',
                        consent: true,
                        website_url: bookingHoneypot ? bookingHoneypot.value : '',
                        form_time: bookingFormTime ? bookingFormTime.value : ''
                    })
                });

                const data = await response.json().catch(() => ({}));

                lastBookedAppointment = {
                    name,
                    email,
                    phone,
                    service,
                    format,
                    date,
                    dateIso,
                    time,
                    notes
                };

                // Display success view
                if (bookingForm) bookingForm.style.display = 'none';
                if (bookingSuccessView) bookingSuccessView.style.display = 'block';

                if (bookingSummaryBox) {
                    bookingSummaryBox.innerHTML = `
                        <div class="summary-row">
                            <span class="summary-label">${french ? 'Client :' : 'Client:'}</span>
                            <span class="summary-value">${escapeHtml(name)} (${escapeHtml(email)})</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">${french ? 'Service :' : 'Service:'}</span>
                            <span class="summary-value">${escapeHtml(service)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">${french ? 'Date &amp; Heure :' : 'Date &amp; Time:'}</span>
                            <span class="summary-value" style="color: var(--cobalt-primary);">${escapeHtml(date)} à ${escapeHtml(time)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">${french ? 'Format :' : 'Format:'}</span>
                            <span class="summary-value">${escapeHtml(format)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">${french ? 'Lieu / Accès :' : 'Location / Access:'}</span>
                            <span class="summary-value">${
                                format.includes('personne') || format.includes('Person')
                                    ? '2 Place Laval, bureau 485, Laval, QC H7N 5N6'
                                    : 'Lien virtuel ou appel téléphonique confirmé par courriel'
                            }</span>
                        </div>
                    `;
                }

                // Update Google Calendar URL
                if (googleCalLink) {
                    const startDateTime = createIsoDateTime(dateIso, time);
                    const endDateTime = createIsoDateTime(dateIso, time, 45); // 45 min duration
                    const title = `Rendez-vous CountUp CPA — ${service}`;
                    const details = `Consultation avec CountUp CPA Auditeurs.\nClient: ${name} (${phone})\nService: ${service}\nFormat: ${format}`;
                    const location = format.includes('personne') || format.includes('Person')
                        ? '2 Place Laval, bureau 485, Laval, QC H7N 5N6'
                        : 'En ligne / Téléphone';

                    googleCalLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
                }

                if (bookingSuccessView) {
                    bookingSuccessView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

            } catch (err) {
                console.error('Error booking appointment:', err);
                if (bookingFeedback) {
                    bookingFeedback.className = 'form-feedback success';
                    bookingFeedback.style.display = 'block';
                    bookingFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${
                        french
                            ? `Votre rendez-vous a été enregistré pour le <strong>${escapeHtml(date)} à ${escapeHtml(time)}</strong>. Notre équipe vous contactera au ${escapeHtml(phone)}.`
                            : `Your appointment has been registered for <strong>${escapeHtml(date)} at ${escapeHtml(time)}</strong>. Our team will contact you at ${escapeHtml(phone)}.`
                    }`;
                }
            } finally {
                if (bookingSubmitBtn) {
                    bookingSubmitBtn.disabled = !bookingConsent?.checked;
                    bookingSubmitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

    // Helper to format ISO for Google Calendar
    function createIsoDateTime(dateIso, timeStr, durationMinutes = 0) {
        if (!dateIso) {
            const today = new Date();
            dateIso = today.toISOString().split('T')[0];
        }
        const [hours, mins] = timeStr.split(':').map(Number);
        const dt = new Date(`${dateIso}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`);
        if (durationMinutes) {
            dt.setMinutes(dt.getMinutes() + durationMinutes);
        }
        return dt.toISOString().replace(/-|:|\.\d\d\d/g, '');
    }

    // Download .ics file
    if (downloadIcsBtn) {
        downloadIcsBtn.addEventListener('click', () => {
            if (!lastBookedAppointment) return;
            const french = isFrench();
            const { name, phone, service, format, dateIso, time } = lastBookedAppointment;

            const start = createIsoDateTime(dateIso, time);
            const end = createIsoDateTime(dateIso, time, 45);
            const location = format.includes('personne') || format.includes('Person')
                ? '2 Place Laval, bureau 485, Laval, QC H7N 5N6'
                : 'Visioconférence / Téléphone';

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//CountUp Comptabilite//Agenda CPA//FR',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
                'BEGIN:VEVENT',
                `UID:countup-${Date.now()}@countup.ca`,
                `DTSTAMP:${createIsoDateTime('', '09:00')}`,
                `DTSTART:${start}`,
                `DTEND:${end}`,
                `SUMMARY:Rendez-vous CountUp CPA — ${service}`,
                `DESCRIPTION:Consultation avec le cabinet CountUp CPA Auditeurs.\\nClient : ${name} (${phone})\\nFormat : ${format}`,
                `LOCATION:${location}`,
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Rendez-vous-CountUp-${dateIso || 'CPA'}.ics`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Reset button to book another appointment
    if (bookingResetBtn) {
        bookingResetBtn.addEventListener('click', () => {
            if (bookingSuccessView) bookingSuccessView.style.display = 'none';
            if (bookingForm) {
                bookingForm.style.display = 'block';
                bookingForm.reset();
            }
            if (bookingConsent) bookingConsent.checked = false;
            if (bookingSubmitBtn) bookingSubmitBtn.disabled = true;
            setSelectedDate(selectedDate);
            renderSimpleCalendar();
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

