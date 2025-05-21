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
        alert('Please fill in all fields.');
        return;
      }
      // Validace e-mailu
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
  
      // Simulace odeslání
      alert(`Thank you for your message, ${name}!`);
      this.reset();
    });
  });
