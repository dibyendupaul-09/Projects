class PasswordGenerator {
  static #DEFAULT_SETTINGS = {
    length: 12,
    characterSets: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
    strengthIndicator: true,
  };

  constructor(settings = {}) {
    this.settings = { ...PasswordGenerator.#DEFAULT_SETTINGS, ...settings };
    this.initElements();
    this.initEventListeners();
    this.updateStrengthIndicator();
  }

  initElements() {
    this.passwordBox = document.getElementById('password');
    this.generateButton = document.getElementById('btn');
    this.copyButton = document.getElementById('copy');
    this.strengthIndicator = document.querySelector('.indicator-bar');
    this.strengthText = document.querySelector('.strength-text');
  }

  initEventListeners() {
    this.generateButton.addEventListener('click', () => this.generatePassword());
    this.copyButton.addEventListener('click', () => this.copyToClipboard());
  }

  getCharacterSet() {
    const { characterSets } = this.settings;
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '@#$%^&*()_+}{|"><=/\\-`~[]',
    };

    return Object.entries(characterSets)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => chars[type])
      .join('');
  }

  getRandomChar(charSet) {
    return charSet[Math.floor(Math.random() * charSet.length)];
  }

  calculateEntropy(password) {
    const charSetSize = this.getCharacterSet().length;
    return Math.log2(charSetSize) * password.length;
  }

  getStrengthCategory(entropy) {
    if (entropy < 45) return { level: 'Weak', color: '#ff4444' };
    if (entropy < 65) return { level: 'Moderate', color: '#ffc107' };
    if (entropy < 85) return { level: 'Strong', color: '#00c851' };
    return { level: 'Very Strong', color: '#00c9a7' };
  }

  updateStrengthIndicator(password = '') {
    if (!this.settings.strengthIndicator) return;
    
    const entropy = password ? this.calculateEntropy(password) : 0;
    const strength = this.getStrengthCategory(entropy);
    const percentage = Math.min((entropy / 100) * 100, 100);

    this.strengthIndicator.style.width = `${percentage}%`;
    this.strengthIndicator.style.backgroundColor = strength.color;
    this.strengthText.textContent = strength.level;
    this.strengthText.style.color = strength.color;
  }

  generatePassword() {
    const charSet = this.getCharacterSet();
    if (!charSet.length) {
      this.showNotification('Please enable at least one character type!', 'error');
      return;
    }

    let password = '';
    const requiredChars = this.getCharacterSet().split('');

    while (password.length < this.settings.length) {
      const randomChar = this.getRandomChar(charSet);
      password += randomChar;
    }

    this.passwordBox.value = password;
    this.updateStrengthIndicator(password);
    this.showNotification('Password generated successfully!', 'success');
  }

  async copyToClipboard() {
    const password = this.passwordBox.value.trim();
    
    if (!password) {
      this.showNotification('No password to copy!', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      this.showNotification('Password copied to clipboard!', 'success');
    } catch (err) {
      this.showNotification('Failed to copy password!', 'error');
      console.error('Clipboard write error:', err);
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

// Initialize password generator with custom settings
const passwordGenerator = new PasswordGenerator({
  length: 14,
  characterSets: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  }
});