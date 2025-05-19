// Form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Získat hodnoty
      const name = this.name.value.trim();
      const email = this.email.value.trim();
      const message = this.message.value.trim();
  
      // Jednoduchá validace
      if (!name || !email || !message) {
        alert('Prosím vyplňte všechna pole.');
        return;
      }
      // Validace e-mailu
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Prosím zadejte platnou e‑mailovou adresu.');
        return;
      }
  
      // Simulace odeslání
      alert(`Děkujeme za vaši zprávu, ${name}!`);
      this.reset();
    });
  });
