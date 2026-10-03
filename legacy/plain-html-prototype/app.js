const whatsappNumber = '917664952255';
const form = document.querySelector('#booking-form');
const today = new Date().toISOString().slice(0, 10);

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelectorAll('input[type="date"]').forEach((input) => input.min = today);

document.querySelector('.menu-button').addEventListener('click', (event) => {
  const nav = document.querySelector('#site-nav');
  const open = nav.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#site-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('#site-nav').classList.remove('is-open');
  document.querySelector('.menu-button').setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.room-inquiry').forEach((button) => button.addEventListener('click', () => {
  const message = `Hello Hotel De Blossom, I would like to enquire about the ${button.dataset.room} room.`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}));

document.querySelectorAll('[data-booking-type]').forEach((link) => link.addEventListener('click', () => {
  form.elements.purpose.value = link.dataset.bookingType;
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    'Hello Hotel De Blossom, I would like to make a reservation request.',
    '',
    `Planning: ${data.get('purpose')}`,
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Check-in: ${data.get('checkIn') || 'To be confirmed'}`,
    `Check-out: ${data.get('checkOut') || 'To be confirmed'}`,
    `Guests: ${data.get('guests')}`,
  ].join('\n');
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
