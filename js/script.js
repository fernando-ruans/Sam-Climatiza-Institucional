// Script para controlar a navbar em scroll
document.addEventListener('DOMContentLoaded', function() {
    // Controlador da navbar em scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Verificar scroll inicial
    if (window.scrollY > 100) {
        document.querySelector('.navbar').classList.add('scrolled');
    }

    // Destacar link ativo na navbar
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animação de contador para os números
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    function countUp() {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const count = parseInt(counter.innerText);
            const increment = Math.trunc(target / speed);
            
            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(countUp, 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Iniciar contador quando a seção estiver visível
    const aboutSection = document.getElementById('sobre');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp();
            }
        });
    });

    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // Scroll suave para links de navegação interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            
            // Fechar o menu de navegação móvel após clicar em um link
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    // Melhorar performance de rolagem em dispositivos móveis
    let isMobile = window.matchMedia("only screen and (max-width: 767px)").matches;
    
    if (isMobile) {
        // Otimização para rolagem mais suave em dispositivos móveis
        let passiveSupported = false;
        try {
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function() { passiveSupported = true; }
            }));
        } catch(err) {}
        
        window.addEventListener('scroll', function() {
            // Aplica otimizações específicas para rolagem em dispositivos móveis
        }, passiveSupported ? { passive: true } : false);
        
        // Adiciona classe específica para o corpo em dispositivos móveis
        document.body.classList.add('mobile-device');
    }
    
    // Configuração para campos de formulário em dispositivos móveis
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Melhora a experiência de toque em dispositivos móveis
        input.addEventListener('focus', function() {
            if (isMobile) {
                this.classList.add('input-active');
            }
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('input-active');
        });
    });
    
    // Detectar orientação do dispositivo e ajustar layout
    window.addEventListener('orientationchange', function() {
        // Pequeno atraso para garantir que as dimensões da janela sejam atualizadas
        setTimeout(function() {
            adjustLayoutForOrientation();
        }, 200);
    });
    
    function adjustLayoutForOrientation() {
        const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        document.body.classList.remove('orientation-portrait', 'orientation-landscape');
        document.body.classList.add('orientation-' + orientation);
    }
    
    // Inicializar a orientação
    adjustLayoutForOrientation();
});

// Função para abrir o email com os dados do formulário
function openEmail(e, formType) {
    e.preventDefault();
    
    let subject, body, emailTo = "samclimatiza@gmail.com";
    
    if (formType === 'contact') {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const servico = document.getElementById('servico').value;
        const mensagem = document.getElementById('mensagem').value;
        
        subject = "Contato pelo site - " + nome;
        body = "Nome: " + nome + 
               "%0D%0AEmail: " + email + 
               "%0D%0ATelefone: " + telefone + 
               "%0D%0AServiço: " + servico + 
               "%0D%0A%0D%0AMensagem: " + mensagem;
    } else if (formType === 'newsletter') {
        const email = document.getElementById('newsletter-email').value;
        subject = "Inscrição Newsletter";
        body = "Email para cadastro: " + email;
    }
    
    // Detecção de dispositivo móvel para método de envio alternativo
    let isMobile = window.matchMedia("only screen and (max-width: 767px)").matches;
    
    if (isMobile && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Em dispositivos móveis, tente usar whatsapp ou formulário nativo
        try {
            // Para Android e alguns dispositivos iOS
            if (formType === 'contact') {
                const whatsappMessage = `Olá, meu nome é ${document.getElementById('nome').value}. ${document.getElementById('mensagem').value}`;
                window.open(`https://wa.me/5531998602232?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
            } else {
                window.open('mailto:' + emailTo + '?subject=' + subject + '&body=' + body);
            }
        } catch (e) {
            // Fallback para mailto
            window.open('mailto:' + emailTo + '?subject=' + subject + '&body=' + body);
        }
    } else {
        // Em desktop, usar mailto normalmente
        window.open('mailto:' + emailTo + '?subject=' + subject + '&body=' + body);
    }
    
    // Feedback visual para o usuário
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Mensagem Enviada";
    submitBtn.classList.add('btn-success');
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-success');
    }, 3000);
    
    // Resetar o formulário após abertura do email
    if (formType === 'contact') {
        document.getElementById('contactForm').reset();
    } else if (formType === 'newsletter') {
        document.getElementById('newsletterForm').reset();
    }
    
    return false;
}