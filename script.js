(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const accordionButtons = document.querySelectorAll('.accordion-button');
  const form = document.querySelector('#quote-form');
  const year = document.querySelector('#current-year');

  year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('menu-open', isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 900 && menu.classList.contains('open') && !menu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const updateHeader = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  accordionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const openItem = document.querySelector('.accordion-item.open');

      if (openItem && openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-button').setAttribute('aria-expanded', 'false');
      }

      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));

    const revealItems = document.querySelectorAll('.service-card, .process-card, .review-card, .about-copy, .about-visual, .coverage-copy, .coverage-map, .faq-intro, .accordion, .contact-copy, .quote-form');
    revealItems.forEach((item) => item.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const setError = (field, message) => {
    field.classList.toggle('invalid', Boolean(message));
    const error = field.closest('label')?.querySelector('.field-error');
    if (error) error.textContent = message;
  };

  const clearErrors = () => {
    form.querySelectorAll('input, select, textarea').forEach((field) => setError(field, ''));
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').replace(/\s+/g, '').trim();
    const city = String(data.get('city') || '').trim();
    const service = String(data.get('service') || '').trim();
    const message = String(data.get('message') || '').trim();

    let valid = true;
    const nameField = form.elements.name;
    const phoneField = form.elements.phone;
    const cityField = form.elements.city;
    const serviceField = form.elements.service;
    const messageField = form.elements.message;

    if (name.length < 2) { setError(nameField, 'Please enter your name.'); valid = false; }
    if (!/^[0-9+()-]{10,15}$/.test(phone)) { setError(phoneField, 'Enter a valid phone number.'); valid = false; }
    if (!city) { setError(cityField, 'Please select your city.'); valid = false; }
    if (!service) { setError(serviceField, 'Please select a service.'); valid = false; }
    if (message.length < 10) { setError(messageField, 'Please add a little more detail.'); valid = false; }

    if (!valid) {
      form.querySelector('.invalid')?.focus();
      return;
    }

    const whatsappMessage = [
      'Hello Sabari Tek, I would like a CCTV service quote.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `City: ${city}`,
      `Service: ${service}`,
      `Requirement: ${message}`
    ].join('\n');

    window.open(`https://wa.me/917845702829?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener,noreferrer');
  });

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => setError(field, ''));
    field.addEventListener('change', () => setError(field, ''));
  });
})();
