// UI interactions and helpers

document.addEventListener('DOMContentLoaded', () => {
  const shopButtons = document.querySelectorAll('.shop-button');
  shopButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const item = e.target.closest('.shop-item');
      if (item) {
        const itemName = item.querySelector('h4')?.textContent || 'Unknown';
        console.log(`🛍️ Shop: ${itemName}`);
        showNotification(`Checkout initiated for: ${itemName}`, 'info');
      }
    });
  });
  
  const downloadButtons = document.querySelectorAll('.media-download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const mediaItem = e.target.closest('.media-item');
      if (mediaItem) {
        const mediaName = mediaItem.querySelector('.media-name')?.textContent || 'Unknown';
        showNotification(`Downloading: ${mediaName}. Verify SHA-256 after download.`, 'info');
      }
    });
  });
});

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
    background: var(--bg-slate); border: 2px solid var(--color-${type === 'error' ? 'crimson' : 'gold'});
    border-radius: 4px; color: var(--color-text-primary); z-index: 1000;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

window.UI = { showNotification, validateEmail };
