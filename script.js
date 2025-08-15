const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

$("#year").textContent = new Date().getFullYear();

// ===== MENU MOBILE - NOVA IMPLEMENTAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (hamburgerBtn && mobileNav) {
    // Toggle do menu
    hamburgerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      mobileNav.classList.toggle('active');
      
      // Atualizar aria-expanded
      const isOpen = mobileNav.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });
    
    // Fechar ao clicar nos links
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
      if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        if (mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
});

// Smooth scroll simplificado e robusto
function smoothScrollTo(target, duration = 800) {
  console.log('Iniciando smooth scroll para:', target);
  
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) {
    console.log('Elemento alvo não encontrado:', target);
    return;
  }

  const headerHeight = 90; // Altura do header + margem
  const targetPosition = targetElement.offsetTop - headerHeight;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  
  console.log('Scroll info:', { 
    target: target, 
    startPosition, 
    targetPosition, 
    distance,
    headerHeight 
  });

  if (distance === 0) {
    console.log('Já está na posição desejada');
    return;
  }

  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Função de easing suave
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const currentPosition = startPosition + distance * easeProgress;
    window.scrollTo(0, currentPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      console.log('Scroll concluído para:', target);
    }
  }

  requestAnimationFrame(animate);
}

// Aplicar smooth scroll a todos os links internos
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  console.log('Links encontrados:', links.length);
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      console.log('Link clicado:', id);
      
      if (id.length > 1) {
        const targetElement = document.querySelector(id);
        if (targetElement) {
          e.preventDefault();
          console.log('Elemento encontrado:', targetElement);
          
          // Efeito visual de clique
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = 'scale(1)';
          }, 150);
          
          // Fechar menu mobile se estiver aberto
          const mobileMenu = document.getElementById('menuMobile');
          const hamburger = document.querySelector('.hamburger');
          if (mobileMenu && hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
            mobileMenu.classList.remove("mobile-menu--open");
            setTimeout(() => {
              mobileMenu.style.display = "none";
            }, 300);
          }
          
          smoothScrollTo(id, 800);
        } else {
          console.log('Elemento não encontrado para:', id);
        }
      }
    });
  });
});

// Smooth scroll para botões da hero section
document.addEventListener('DOMContentLoaded', function() {
  const heroButtons = document.querySelectorAll('.hero__actions .btn');
  heroButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href, 800);
      }
    });
  });
});

// Reveal on scroll - Otimizado
document.addEventListener('DOMContentLoaded', function() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  const animatedElements = document.querySelectorAll("[data-animate]");
  animatedElements.forEach(el => {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(el);
  });
});

// Parallax leve - desabilitado temporariamente para evitar scroll automático
// window.addEventListener("scroll", () => {
//   const y = window.scrollY;
//   $$("[data-parallax]").forEach(el => {
//     el.style.transform = `translateY(${y * -0.06}px)`;
//   });
// }, { passive: true });

// ==== Grid de Especialidades Atendidas (Layout Estático) ====
// Removido o carrossel automático - agora é um grid estático com 4x2 cards

// ==== Galeria: Botão "Exibir mais" e "Mostrar menos" ====
document.addEventListener('DOMContentLoaded', function() {
  const btnExibirMais = document.getElementById('btnExibirMais');
  const fotosOcultas = document.querySelectorAll('.galeria-item--hidden');
  
  if (!btnExibirMais || fotosOcultas.length === 0) return;
  
  btnExibirMais.addEventListener('click', function() {
    const isExpanded = btnExibirMais.classList.contains('btn--contrair');
    
    if (isExpanded) {
      // Esconder todas as fotos ocultas rapidamente
      fotosOcultas.forEach(foto => {
        foto.classList.remove('show');
      });
      
      // Restaurar texto e funcionalidade do botão
      btnExibirMais.textContent = 'Exibir mais fotos';
      btnExibirMais.classList.remove('btn--contrair');
    } else {
      // Desabilitar o botão durante a animação
      btnExibirMais.disabled = true;
      btnExibirMais.textContent = 'Carregando...';
      
      // Mostrar fotos uma de cada vez com delay
      fotosOcultas.forEach((foto, index) => {
        setTimeout(() => {
          foto.classList.add('show');
          
          // Se for a última foto, habilitar o botão novamente
          if (index === fotosOcultas.length - 1) {
            btnExibirMais.disabled = false;
            btnExibirMais.textContent = 'Mostrar menos';
            btnExibirMais.classList.add('btn--contrair');
            
            // Scroll suave para a galeria expandida
            setTimeout(() => {
              const galeriaSection = document.getElementById('galeria');
              if (galeriaSection) {
                galeriaSection.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'nearest' 
                });
              }
            }, 200);
          }
        }, index * 80); // 80ms de delay entre cada foto
      });
    }
  });
});

// ==== Imagem estática na seção sobre ====
// Removido o carrossel automático - agora é uma imagem estática

// ==== Efeitos de texto simplificados (Desktop) ====
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se é desktop
  if (window.innerWidth <= 900) return;

  // Observer simples para animações de entrada
  const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('text-revealed');
        textObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Observar títulos principais
  const titles = document.querySelectorAll('#tit-sobre, #tit-especialistas');
  titles.forEach(title => {
    textObserver.observe(title);
  });
});

// ==== Cards com rotação 3D ====
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.especialidades-grid .card');
  let activeCard = null;
  
  // Função para fechar card ativo
  function closeActiveCard() {
    if (activeCard) {
      activeCard.classList.remove('card--flipped');
      activeCard = null;
    }
  }
  
  // Adicionar eventos aos cards
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Verificar se o clique foi no botão
      if (e.target.closest('.btn--card')) {
        return; // Não fazer nada se clicou no botão
      }
      
      // Só aplicar no mobile (telas menores que 769px)
      if (window.innerWidth < 769) {
        e.preventDefault();
        e.stopPropagation();
        
        // Se já tem um card ativo, fechar
        if (activeCard && activeCard !== this) {
          activeCard.classList.remove('card--flipped');
        }
        
        // Toggle do card atual
        if (this.classList.contains('card--flipped')) {
          this.classList.remove('card--flipped');
          activeCard = null;
        } else {
          this.classList.add('card--flipped');
          activeCard = this;
        }
      }
    });
  });
  
  // Fechar card ao clicar fora
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.especialidades-grid .card')) {
      closeActiveCard();
    }
  });
  
  // Fechar card ao redimensionar a tela (quando muda de mobile para desktop)
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 769) {
      closeActiveCard();
    }
  });
});

// ==== Detectar seção atual e aplicar sublinhado ====
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const sections = document.querySelectorAll('section[id]');
  
  let ticking = false;
  
  function updateActiveLink() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + 100; // Offset para header
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remover classe active de todos os links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Adicionar classe active ao link correspondente
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  }
  
  // Atualizar no scroll com throttling
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  
  // Atualizar na carga da página
  updateActiveLink();
});

// ==== Scroll suave para seção de contato ====
document.addEventListener('DOMContentLoaded', function() {
  const contactLinks = document.querySelectorAll('a[href="#contato"]');
  const contactSection = document.getElementById('contato');
  
  contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (contactSection) {
        const headerHeight = 90; // Altura do header + margem
        const targetPosition = contactSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Scroll suave para links de telefone e WhatsApp
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  
  [...phoneLinks, ...whatsappLinks].forEach(link => {
    link.addEventListener('click', function(e) {
      // Pequeno delay para permitir que o usuário veja o clique
      setTimeout(() => {
        // O link externo será aberto normalmente
      }, 100);
    });
  });
});

// ==== Modal de Imagem ====
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  
  let currentImageIndex = 0;
  let images = [];
  
  // Função para abrir o modal
  function openModal(imageSrc, imageIndex) {
    modalImage.src = imageSrc;
    currentImageIndex = imageIndex;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Atualizar visibilidade das setas
    updateNavButtons();
  }
  
  // Função para fechar o modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Função para navegar entre imagens
  function navigateImage(direction) {
    if (direction === 'prev' && currentImageIndex > 0) {
      currentImageIndex--;
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      currentImageIndex++;
    }
    
    modalImage.src = images[currentImageIndex];
    updateNavButtons();
  }
  
  // Função para atualizar visibilidade dos botões de navegação
  function updateNavButtons() {
    modalPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    modalNext.style.display = currentImageIndex < images.length - 1 ? 'flex' : 'none';
  }
  
  // Event listeners
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
  
  modalPrev.addEventListener('click', () => navigateImage('prev'));
  modalNext.addEventListener('click', () => navigateImage('next'));
  
  // Fechar com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    } else if (e.key === 'ArrowLeft' && modal.classList.contains('active')) {
      navigateImage('prev');
    } else if (e.key === 'ArrowRight' && modal.classList.contains('active')) {
      navigateImage('next');
    }
  });
  
  // Adicionar click nas imagens da galeria
  const galeriaImages = document.querySelectorAll('.galeria-item img');
  galeriaImages.forEach((img, index) => {
    images.push(img.src);
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openModal(img.src, index));
  });
});
