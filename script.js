(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-menu > a')];
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('cv-theme'); } catch (_) { /* Storage may be blocked on local previews. */ }

  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }

  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    try { localStorage.setItem('cv-theme', nextTheme); } catch (_) { /* Keep the visual toggle working without persistence. */ }
  });

  const closeMenu = () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Abrir menú');
  };

  navToggle?.addEventListener('click', () => {
    const open = navMenu?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target.querySelector('.skill-track span');
      if (bar) bar.style.width = `${entry.target.dataset.level}%`;
      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.skill').forEach(skill => skillObserver.observe(skill));

  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  const coursesButton = document.querySelector('.courses-toggle');
  const coursesList = document.querySelector('.courses-list');
  coursesButton?.addEventListener('click', () => {
    const expanded = coursesList.classList.toggle('expanded');
    coursesButton.setAttribute('aria-expanded', String(expanded));
    coursesButton.textContent = expanded ? 'Mostrar menos' : 'Ver todos los cursos';
  });

  document.getElementById('current-year').textContent = new Date().getFullYear();
})();
