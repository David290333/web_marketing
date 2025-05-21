document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const thankYou = document.getElementById('thankYouMessage');

  form.addEventListener('submit', function (e) {
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      alert('Prosím vyplňte všechna pole.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      e.preventDefault();
      alert('Prosím zadejte platnou e‑mailovou adresu.');
      return;
    }

    e.preventDefault(); // Zabráníme výchozímu odeslání (abychom mohli ukázat zprávu)

    thankYou.style.display = 'block';
    form.reset();

    setTimeout(() => {
      thankYou.style.display = 'none';
    }, 3000); // zpráva zmizí po 3 sekundách
  });
});