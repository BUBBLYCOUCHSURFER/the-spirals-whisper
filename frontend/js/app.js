// Main application logic

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Cardbound Chronicles: Dungeon Run - Initializing...');
  
  initializeClassTabs();
  initializeScrollAnimations();
});

function initializeClassTabs() {
  const tabs = document.querySelectorAll('.class-tab');
  const infoPanels = document.querySelectorAll('.class-info');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const classType = tab.dataset.class;
      tabs.forEach(t => t.classList.remove('active'));
      infoPanels.forEach(panel => panel.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.getElementById(`${classType}-info`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
  
  if (tabs.length > 0) tabs[0].click();
}

function initializeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.section-title, .card-display, .shop-panel').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function trackEvent(eventName, eventData = {}) {
  console.log(`📊 Event: ${eventName}`, eventData);
}

function handlePurchase(itemType, itemId) {
  console.log(`💳 Purchase initiated: ${itemType} - ${itemId}`);
  trackEvent('purchase_initiated', { itemType, itemId });
}

window.APP = { scrollToSection, trackEvent, handlePurchase };
