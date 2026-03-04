// Mock storage for the breathwork app
export const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.storage = storage;
}
