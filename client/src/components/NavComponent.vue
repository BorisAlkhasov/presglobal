<template>
  <nav class="nav">
    <p class="text-logo">TimeClock</p>
    <div class="controls">
      <div class="dropdown">
        <button @click="toggleDropdown" class="dropdown-button">
          Export
          <svg class="dropdown-arrow" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <div v-if="isDropdownOpen" class="dropdown-content">
          <button @click="exportAs('PDF')">PDF</button>
          <button @click="exportAs('CSV')">CSV</button>
          <button @click="exportAs('XLS')">XLS</button>
        </div>
      </div>
      <button @click="logout" class="logout-button">
        <svg class="logout-icon" viewBox="0 0 24 24">
          <path
            d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
          />
        </svg>
        Logout
      </button>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      isDropdownOpen: false,
    };
  },
  methods: {
    ...mapActions(['logout']),
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    exportAs(format) {
      // TODO export functionality
      console.log(`Exporting as ${format}`);
      this.isDropdownOpen = false;
    },
  },
};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}

.text-logo {
  font-size: 2rem;
}

.dropdown {
  position: relative;
}

.dropdown-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  margin-left: 8px;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  min-width: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem 0;
}

.dropdown-content button {
  border: none;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  padding: 0.2rem;
}

.dropdown-content button:hover {
  font-weight: 700;
}

.controls {
  display: flex;
  gap: 2rem;
}

.logout-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #333;
}

.logout-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.logout-button:hover {
  background-color: #e0e0e0;
}
</style>
