
AOS.init({
    duration: 1000,
    offset: 100,
    easing: 'ease-out-cubic',
    once: false, 
    mirror: true  
});

// ==================== EmailJS Configuration ====================
const EMAILJS_CONFIG = {
    publicKey:   'BEMgp0qzGZBCotJaq',        
    serviceID:   'service_iyc8ctv',      
    templateID:  'template_90tfmcr'       
};

// Initialize EmailJS
if (
  typeof emailjs !== 'undefined' &&
  EMAILJS_CONFIG.publicKey !== 'YOUR_REAL_PUBLIC_KEY'
) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ==================== DOM Ready ====================
document.addEventListener('DOMContentLoaded', function() {

    // ========== Navigation ==========
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    function smoothScrollTo(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // ========== Hero button smooth scroll ==========
    const heroButtons = document.querySelectorAll('.hero-cta .btn');
    heroButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                smoothScrollTo(targetId);
            }
        });
    });

    // ========== Scroll-to-top button ==========
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== Navbar and top button visibility ==========
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (navbar) {
            if (scrolled > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
        if (scrollToTopBtn) {
            if (scrolled > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    });

    // ========== Modal feedback ==========
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    function showModal(type, title, message) {
        if (!modal) return;
        const iconElement = modalIcon.querySelector('i');
        if (type === 'success') {
            modalIcon.className = 'modal-icon success';
            if (iconElement) iconElement.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            modalIcon.className = 'modal-icon error';
            if (iconElement) iconElement.className = 'fas fa-exclamation-triangle';
        }
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideModal();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            hideModal();
        }
    });

    // ========== Contact Form with EmailJS ========== 
    const contactForm = document.getElementById('contactForm'); // ✅ Fixed ID
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            
            if (!nameInput || !emailInput || !messageInput) {
                showModal('error', 'Error', 'Form elements not found');
                return;
            }
            
            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput ? phoneInput.value.trim() : '',
                message: messageInput.value.trim()
            };
            
            // Validation
            const errors = [];
            if (!formData.name) errors.push('Name is required');
            else if (formData.name.length < 2) errors.push('Name must be at least 2 characters');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) errors.push('Email is required');
            else if (!emailRegex.test(formData.email)) errors.push('Please enter a valid email');
            
            if (!formData.message) errors.push('Message is required');
            else if (formData.message.length < 10) errors.push('Message must be at least 10 characters');
            
            if (errors.length > 0) {
                showModal('error', 'Validation Error', errors.join('. '));
                return;
            }

            // Submit button loading UI
            const submitBtn = contactForm.querySelector('.btn'); // ✅ Fixed selector
            const btnText = submitBtn.querySelector('span'); // ✅ Fixed selector
            const btnIcon = submitBtn.querySelector('i'); // ✅ Fixed selector
            
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';

            // Send Email via EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.send(
                    EMAILJS_CONFIG.serviceID,
                    EMAILJS_CONFIG.templateID,
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        message: formData.message,
                        to_name: 'Ankit Das'
                    }
                ).then(function() {
                    showModal('success','Message Sent!','Thank you for your message! I\'ll get back to you soon.');
                    contactForm.reset();
                }).catch(function() {
                    showModal('error','Error','Failed to send message. Please try again.');
                }).finally(function() {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'Send Message';
                    if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
                });
            } else {
                showModal('error', 'Error', 'EmailJS not loaded. Please check connection.');
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
            }
        });
    }

    // ========== Scroll indicator fade out ==========
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            if (scrolled > windowHeight * 0.1) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '0.8';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    }

    // ========== Active nav link highlight ==========
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
        const observer = new IntersectionObserver(
            function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        navLinks.forEach(function(link) {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + entry.target.id) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-70px 0px 0px 0px'
            }
        );
        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    console.log('Portfolio loaded successfully!');
});

// ========== Page load: refresh AOS ========== 
window.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

console.log(`
🚀 Ankit Das Portfolio Website
📧 Email contact form: EmailJS enabled!
`);