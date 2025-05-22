document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const thankYou = document.getElementById('thankYouMessage');

  form.addEventListener('submit', function (e) {
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    // Validace
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

    // ✅ Nesmí být e.preventDefault() zde – jinak se formulář neodešle
    // FormSubmit se postará o zbytek automaticky
  });
});
