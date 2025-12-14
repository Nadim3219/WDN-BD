(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        // =================================================================
        // 1. MOBILE MENU & NAVIGATION LOGIC
        // =================================================================
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenu = document.getElementById('mobileMenu');
        const body = document.body;

        if (mobileMenuToggle && closeMobileMenuBtn && mobileMenuOverlay && mobileMenu) {
            
            function openMobileMenu() {
                mobileMenu.classList.add('active');
                mobileMenuOverlay.classList.add('active');
                body.classList.add('menu-open');
            }

            function closeMobileMenu() {
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            }

            mobileMenuToggle.addEventListener('click', openMobileMenu);
            closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);

            const mobileLinks = document.querySelectorAll('.d2c_mobile_view_body .nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            window.addEventListener('resize', function() {
                if (window.innerWidth >= 992 && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
            
            function preventBodyScroll() {
                if (mobileMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                    document.documentElement.style.overflow = 'hidden';
                } else {
                    if (document.body.style.overflow === 'hidden') {
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';
                    }
                }
            }
            
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class' && mutation.target === mobileMenu) {
                        preventBodyScroll();
                    }
                });
            });
            
            observer.observe(mobileMenu, { attributes: true });
            
        }
        
        // =================================================================
        // 2. SCROLL & ANIMATION LOGIC
        // =================================================================
        const sections = document.querySelectorAll('section');

        function checkScroll() {
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 100) {
                    section.classList.add('visible');
                }
            });
        }

        function setActiveNavLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        const serviceBoxes = document.querySelectorAll('.service');

        function animateServiceBoxes() {
            serviceBoxes.forEach((box, index) => {
                const boxTop = box.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (boxTop < windowHeight - 100) {
                    setTimeout(() => {
                        box.style.opacity = '1';
                        box.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }
        
        // =================================================================
        // 3. EVENT LISTENERS FOR SCROLL & LOAD
        // =================================================================

        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.d2c_navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                    body.classList.add('has-fixed-nav');
                } else {
                    navbar.classList.remove('scrolled');
                    body.classList.remove('has-fixed-nav');
                }
            }
        });

        window.addEventListener('scroll', checkScroll);
        window.addEventListener('scroll', animateServiceBoxes);
        window.addEventListener('scroll', setActiveNavLink);

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        window.addEventListener('load', function() {
            if (window.scrollY > 50) {
                body.classList.add('has-fixed-nav');
            }
            
            checkScroll();
            animateServiceBoxes();
            setActiveNavLink();
        });

        // =================================================================
        // 4. SLIDER LOGIC
        // =================================================================
        const track = document.getElementById("track");
        if (track) {
            let cards = Array.from(document.querySelectorAll(".card"));
            
            if (cards.length > 0) {
                let index = 0;
                // Duplicate content for infinite loop effect
                track.innerHTML += track.innerHTML;
                cards = document.querySelectorAll(".card");
                
                function getStep() {
                    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
                    return cards[0].offsetWidth + gap;
                }

                function slideTo(i) {
                    track.style.transform = `translateX(-${i * getStep()}px)`;
                }

                function fixLoop() {
                    const halfLength = cards.length / 2;
                    const halfWidth = halfLength * getStep();

                    if (index * getStep() >= halfWidth) {
                        track.style.transition = "none";
                        index = 0;
                        slideTo(index);

                        setTimeout(() => {
                            track.style.transition = "transform 0.45s linear";
                        }, 20);
                    }
                }

                let autoPlay = setInterval(() => {
                    index++;
                    slideTo(index);
                    fixLoop();
                }, 2500);

                function restartAuto() {
                    clearInterval(autoPlay);
                    autoPlay = setInterval(() => {
                        index++;
                        slideTo(index);
                        fixLoop();
                    }, 2500);
                }
                
                const nextButton = document.getElementById("next");
                if (nextButton) {
                    nextButton.onclick = () => {
                        index++;
                        slideTo(index);
                        fixLoop();
                        restartAuto();
                    };
                }

                const prevButton = document.getElementById("prev");
                if (prevButton) {
                    prevButton.onclick = () => {
                        index--;

                        if (index < 0) {
                            track.style.transition = "none";
                            index = cards.length / 2 - 1; 
                            slideTo(index);

                            setTimeout(() => {
                                track.style.transition = "transform 0.45s linear";
                            }, 20);
                        } else {
                            slideTo(index);
                        }

                        restartAuto();
                    };
                }

                window.addEventListener("resize", () => {
                    slideTo(index);
                });
            }
        }

        // =================================================================
        // 5. TELEGRAM INTEGRATION (Footer Email Input)
        // =================================================================
        const sendBtn = document.getElementById("sendBtn");
        const userEmail = document.getElementById("userEmail");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (sendBtn && userEmail) {

            sendBtn.addEventListener("click", function() {
                let email = userEmail.value.trim();

                if (email === "") {
                    // TODO: Replace alert with showModal function for consistent UX
                    alert("Please enter your email!"); 
                    return;
                }
                if (!emailPattern.test(email)) { 
                    // TODO: Replace alert with showModal function
                    alert("Please enter a valid email address!"); 
                    return;
                }

                let phone = "8801608069154";
                let textMessage = encodeURIComponent("User Email: " + email);
                let tgLink = "https://t.me/+" + phone + "?text=" + textMessage;
                window.open(tgLink, "_blank"); 
            });
        }


        // =================================================================
        // 6. CONTACT FORM VALIDATION & Formspree SUBMISSION
        // =================================================================
        
        // Essential DOM Elements for Modal
        const form = document.getElementById('contactForm');
        const modalOverlay = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalCloseButton = document.getElementById('modalCloseButton');
        const modalIcon = document.getElementById('modalIcon'); 

      
        if (form && modalOverlay && modalIcon) { 

            const FORMSPREE_URL = 'https://formspree.io/f/xovgbqkj';

            const validationRules = {
                firstName: { required: true, minLength: 3, pattern: /^[a-zA-Z\s\-']+$/ },
                lastName: { required: true, minLength: 2, pattern: /^[a-zA-Z\s\-']+$/ },
                email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                message: { required: true, minLength: 6, maxLength: 500 }
            };

            // --- Modal Functions (Updated for Advanced CSS) ---

            function showModal(title, message, isSuccess) {
                modalTitle.textContent = title;
                modalBody.textContent = message;

                // Resetting colors and classes
                modalIcon.classList.remove('success', 'error', 'warning');
                modalTitle.style.color = ''; 
                
                // Icon and Color Logic
                if (isSuccess === true) {
                    modalTitle.style.color = '#28a745';
                    modalIcon.textContent = '✔️';
                    modalIcon.classList.add('success');
                } else if (isSuccess === false) {
                    modalTitle.style.color = '#dc3545'; 
                    modalIcon.textContent = '❌';
                    modalIcon.classList.add('error');
                } else {
                    modalTitle.style.color = '#ffc107'; 
                    modalIcon.textContent = '⚠️'; 
                    modalIcon.classList.add('warning');
                }
                
                modalOverlay.classList.remove('hidden');
                
                setTimeout(() => {
                     modalOverlay.classList.add('active'); 
                }, 10); 
                
                modalCloseButton.focus();
            }

            function closeModal() {
                // Start fade-out animation
                modalOverlay.classList.remove('active'); 
                
                // Hide completely after the CSS transition (300ms) ends
                setTimeout(() => {
                    modalOverlay.classList.add('hidden');
                }, 300); 
            }

            // Event listeners for modal closing
            modalCloseButton.addEventListener('click', closeModal);

            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && modalOverlay && !modalOverlay.classList.contains('hidden')) {
                    closeModal();
                }
            });

            // --- Validation Functions (Same as before) ---

            function showError(fieldId, message) {
                const errorElement = document.getElementById(fieldId + 'Error');
                const inputElement = document.getElementById(fieldId);
                if (errorElement) errorElement.textContent = message;
                if (inputElement) inputElement.classList.add('error');
                if (errorElement) errorElement.style.display = 'block';
            }

            function clearError(fieldId) {
                const errorElement = document.getElementById(fieldId + 'Error');
                const inputElement = document.getElementById(fieldId);
                if (errorElement) { errorElement.textContent = ''; errorElement.style.display = 'none'; }
                if (inputElement) inputElement.classList.remove('error');
            }

            function validateField(fieldId) {
                const input = document.getElementById(fieldId);
                if (!input) return true;
                const rules = validationRules[fieldId];
                const value = input.value.trim();
                let isValid = true;
                clearError(fieldId);

                if (rules.required && value === '') {
                    showError(fieldId, `${input.name} is required.`);
                    isValid = false;
                } else if (rules.minLength && value.length < rules.minLength) {
                    showError(fieldId, `${input.name} must be at least ${rules.minLength} characters.`);
                    isValid = false;
                } else if (rules.maxLength && value.length > rules.maxLength) {
                    showError(fieldId, `${input.name} cannot exceed ${rules.maxLength} characters.`);
                    isValid = false;
                } else if (rules.pattern && !rules.pattern.test(value)) {
                    let message = `${input.name} is not in a valid format.`;
                    if (fieldId === 'email') message = 'Please enter a valid email address.';
                    else if (fieldId === 'firstName' || fieldId === 'lastName') message = `${input.name} can only contain letters, spaces, hyphens, and apostrophes.`;
                    showError(fieldId, message);
                    isValid = false;
                }
                return isValid;
            }

            // Add event listeners for input validation
            Object.keys(validationRules).forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.addEventListener('input', () => validateField(fieldId));
                    input.addEventListener('blur', () => validateField(fieldId));
                }
            });

            // --- Form Submission Handler ---

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let isFormValid = true;
                
                // Re-validate all fields on submit
                Object.keys(validationRules).forEach(fieldId => {
                    if (!validateField(fieldId)) isFormValid = false;
                });

                if (isFormValid) {
                    const formData = new FormData(form);

                    fetch(FORMSPREE_URL, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            showModal('✅ Success!', 'Message sent successfully! Thank you.', true); // true for success
                            form.reset();
                        } else {
                            response.json().then(data => {
                                showModal('❌ Submission Failed', `Submission failed: ${data.error || 'Server error'}. Please try again later.`, false); // false for error
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Network Error:', error);
                        showModal('❌ Network Error', 'Submission failed due to a network error. Please check your connection.', false); // false for error
                    })
                    .finally(() => {
                        // Automatically close the modal after 5 seconds
                        setTimeout(closeModal, 5000); 
                    });
                
                } else {
                   
                    showModal('⚠️ Validation Error', 'Please correct the errors above and try again.'); 
                    
                  
                    const firstInvalid = document.querySelector('.error');
                    if (firstInvalid) firstInvalid.focus();
                    
                    setTimeout(closeModal, 5000);
                }
            });
        }        

    }); 
})(); 