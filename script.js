(function() {
    
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

    // --- Slider JS ---
    const track = document.getElementById("track");
    if (track) {
        let cards = Array.from(document.querySelectorAll(".card"));
        
        if (cards.length > 0) {
            let index = 0;
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

    // --- Form Validation JS ---
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        if (!form) return;
        
        const validationRules = {
            firstName: {
                required: true,
                minLength: 3,
                pattern: /^[a-zA-Z\s\-']+$/
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s\-']+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 500
            }
        };

        function showError(fieldId, message) {
            const errorElement = document.getElementById(fieldId + 'Error');
            const inputElement = document.getElementById(fieldId);
            
            if (errorElement) errorElement.textContent = message;
            if (inputElement) inputElement.classList.add('error');
        }

        function clearError(fieldId) {
            const errorElement = document.getElementById(fieldId + 'Error');
            const inputElement = document.getElementById(fieldId);
            
            if (errorElement) errorElement.textContent = '';
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
            } 
            
            else if (rules.minLength && value.length < rules.minLength) {
                showError(fieldId, `${input.name} must be at least ${rules.minLength} characters.`);
                isValid = false;
            }

            else if (rules.maxLength && value.length > rules.maxLength) {
                showError(fieldId, `${input.name} cannot exceed ${rules.maxLength} characters.`);
                isValid = false;
            }
            
            else if (rules.pattern && !rules.pattern.test(value)) {
                let message = `${input.name} is not in a valid format.`;
                if (fieldId === 'email') {
                    message = 'Please enter a valid email address.';
                } else if (fieldId === 'firstName' || fieldId === 'lastName') {
                    message = `${input.name} can only contain letters, spaces, hyphens, and apostrophes.`;
                }
                showError(fieldId, message);
                isValid = false;
            }
            
            return isValid;
        }

        Object.keys(validationRules).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                input.addEventListener('input', () => validateField(fieldId));
                input.addEventListener('blur', () => validateField(fieldId));
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            
            Object.keys(validationRules).forEach(fieldId => {
                if (!validateField(fieldId)) {
                    isFormValid = false;
                }
            });
            
            if (successMessage) successMessage.textContent = '';

            if (isFormValid) {
                const formData = {
                    firstName: form.firstName.value.trim(),
                    lastName: form.lastName.value.trim(),
                    email: form.email.value.trim(),
                    message: form.message.value.trim()
                };

                console.log('Form is valid. Data to be sent:', formData);
                
                if (successMessage) {
                    successMessage.textContent = '✅ Message sent successfully! Thank you.';
                }
                form.reset();
                setTimeout(() => {
                    if (successMessage) successMessage.textContent = '';
                }, 5000);

            } else {
                const firstInvalid = document.querySelector('.error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                if (successMessage) {
                    successMessage.textContent = '❌ Please correct the errors above and try again.';
                }
            }
        });
    });

})();

//telegram input
document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById("sendBtn");
    const userEmail = document.getElementById("userEmail");

    if (!sendBtn || !userEmail) return;

    sendBtn.addEventListener("click", function() {
        let email = userEmail.value.trim();

        if (email === "") {
            alert("Please enter your email!");
            return;
        }

        let phone = "8801608069154";
        let textMessage = encodeURIComponent("User Email: " + email);
        let tgLink = "https://t.me/+" + phone + "?text=" + textMessage;
        window.open(tgLink, "_blank");
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    const validationRules = {
        firstName: { required: true, minLength: 3, pattern: /^[a-zA-Z\s\-']+$/ },
        lastName: { required: true, minLength: 2, pattern: /^[a-zA-Z\s\-']+$/ },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        message: { required: true, minLength: 10, maxLength: 500 }
    };

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

    Object.keys(validationRules).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', () => validateField(fieldId));
            input.addEventListener('blur', () => validateField(fieldId));
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isFormValid = true;
        Object.keys(validationRules).forEach(fieldId => {
            if (!validateField(fieldId)) isFormValid = false;
        });

        if (isFormValid) {
            if (successMessage) {
                successMessage.textContent = '✅ Message sent successfully! Thank you.';
                successMessage.style.display = 'block';
            }
            form.submit();
        } else {
            if (successMessage) {
                successMessage.textContent = '❌ Please correct the errors above and try again.';
                successMessage.style.display = 'block';
            }
            const firstInvalid = document.querySelector('.error');
            if (firstInvalid) firstInvalid.focus();
        }
    });
});
