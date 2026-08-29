// Alternância de tema claro/escuro
(function () {
  document.documentElement.classList.add('js');

  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'escuro' ? 'escuro' : 'claro';
      const next = current === 'escuro' ? 'claro' : 'escuro';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Menu mobile
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Destaque do link ativo conforme rolagem
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-links a');

  if (sections.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      const pos = window.scrollY + 120;

      sections.forEach((section) => {
        if (pos >= section.offsetTop) {
          current = section.getAttribute('id');
        }
      });

      links.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  // Animação de reveal conforme a rolagem
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }
})();
