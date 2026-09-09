document.addEventListener('DOMContentLoaded', () => {
    // Top Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Animation on scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // FAQ Accordion Logic
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
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
    // Modal Logic for Client Portal
    // ==========================================
    const modal = document.getElementById('portal-modal');
    const portalBtns = document.querySelectorAll('.portal-btn');
    const closeModal = document.querySelector('.close-modal');
    const overlay = document.querySelector('.modal-overlay');

    const openModalFunc = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
    };

    const closeModalFunc = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // enable scrolling
    };

    if (modal && portalBtns) {
        portalBtns.forEach(btn => btn.addEventListener('click', openModalFunc));
        if (closeModal) closeModal.addEventListener('click', closeModalFunc);
        if (overlay) overlay.addEventListener('click', closeModalFunc);
    }

    // ==========================================
    // Form Submission Interactions
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const btn = contactForm.querySelector('button');
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending / Envoi...';
            btn.disabled = true;

            const isFrench = document.documentElement.lang === 'fr';

            setTimeout(() => {
                if (isFrench) {
                    alert(`Merci, ${name} ! Votre message a été envoyé avec succès. Un représentant de CountUp vous contactera sous peu.`);
                } else {
                    alert(`Thank you, ${name}! Your message has been sent successfully. A CountUp representative will reach out shortly.`);
                }
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }

    // ==========================================
    // Tax Checklist Download CTA
    // ==========================================
    const checklistBtn = document.getElementById('download-checklist');
    if (checklistBtn) {
        checklistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isFrench = document.documentElement.lang === 'fr';
            const email = prompt(isFrench ? "Veuillez entrer votre adresse courriel pour recevoir la liste de vérification PDF :" : "Please enter your email to receive the Tax Checklist PDF:");
            if (email && email.trim() !== '') {
                alert(isFrench ? `Merci ! La liste de vérification des documents fiscaux a été envoyée à ${email}.` : `Thank you! The tax document checklist has been sent to ${email}.`);
            }
        });
    }
});

