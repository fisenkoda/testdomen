/* ============================================================
   Sticky header shadow
   ============================================================ */
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================================
   Burger / mobile menu
   ============================================================ */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ============================================================
   FAQ accordion
   ============================================================ */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn    = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    faqItems.forEach(other => {
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-answer').classList.remove('open');
    });

    // Open current if it was closed
    if (!isExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

/* ============================================================
   Phone mask  +7 (___) ___-__-__
   ============================================================ */
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('focus', () => {
  if (!phoneInput.value) phoneInput.value = '+7 ';
});

phoneInput.addEventListener('input', formatPhone);

function formatPhone(e) {
  let raw = e.target.value.replace(/\D/g, '');

  // Strip leading 7 or 8
  if (raw.startsWith('7') || raw.startsWith('8')) raw = raw.slice(1);

  // Limit to 10 digits
  raw = raw.slice(0, 10);

  let out = '+7';
  if (raw.length > 0) out += ' (' + raw.slice(0, 3);
  if (raw.length >= 3) out += ') ' + raw.slice(3, 6);
  if (raw.length >= 6) out += '-' + raw.slice(6, 8);
  if (raw.length >= 8) out += '-' + raw.slice(8, 10);

  e.target.value = out;
}

phoneInput.addEventListener('keydown', e => {
  // Prevent deleting the prefix "+7 "
  const sel = phoneInput.selectionStart;
  if (e.key === 'Backspace' && sel <= 3) e.preventDefault();
});

/* ============================================================
   Form validation & submission
   ============================================================ */
const form  = document.getElementById('signup-form');
const toast = document.getElementById('toast');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;

  const data = {
    parentName:  field('parent-name').value.trim(),
    phone:       field('phone').value,
    childAge:    field('child-age').value,
    shift:       field('shift').value,
    comment:     field('comment').value.trim(),
    consentPd:   field('consent-pd').checked,
    consentNews: field('consent-news').checked,
  };

  console.log('Заявка:', data);

  form.reset();
  showToast('Заявка отправлена. Свяжемся в течение часа.');
});

function validate() {
  let ok = true;

  const name = field('parent-name');
  if (!name.value.trim()) {
    setError('parent-name', 'error-parent-name', 'Введите ваше имя');
    ok = false;
  } else {
    clearError('parent-name', 'error-parent-name');
  }

  const phone = field('phone');
  if (!isValidPhone(phone.value)) {
    setError('phone', 'error-phone', 'Введите корректный номер телефона');
    ok = false;
  } else {
    clearError('phone', 'error-phone');
  }

  const age = field('child-age');
  if (!age.value) {
    setError('child-age', 'error-child-age', 'Выберите возраст ребёнка');
    ok = false;
  } else {
    clearError('child-age', 'error-child-age');
  }

  const pd = field('consent-pd');
  const pdErr = document.getElementById('error-consent-pd');
  if (!pd.checked) {
    pdErr.textContent = 'Необходимо ваше согласие';
    ok = false;
  } else {
    pdErr.textContent = '';
  }

  return ok;
}

function isValidPhone(val) {
  return val.replace(/\D/g, '').length === 11;
}

function field(id) {
  return document.getElementById(id);
}

function setError(fieldId, errorId, msg) {
  field(fieldId).classList.add('error');
  document.getElementById(errorId).textContent = msg;
}

function clearError(fieldId, errorId) {
  field(fieldId).classList.remove('error');
  document.getElementById(errorId).textContent = '';
}

// Clear field error on input
['parent-name', 'phone', 'child-age'].forEach(id => {
  field(id).addEventListener('input', () => field(id).classList.remove('error'));
});

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;

function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}
