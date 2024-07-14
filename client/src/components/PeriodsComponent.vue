<template>
  <div class="periods-container">
    <div class="shifts-dropdown">
      <label class="labelStyle" for="selectPeriod">Shifts for current</label>
      <select
        v-model="selectedOption"
        @change="setPeriod({ period: selectedOption })"
        id="selectPeriod"
        class="selectStyle"
      >
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      selectedOption: 'Day',
      options: ['Day', 'Month'],
    };
  },
  methods: mapActions(['setPeriod']),
};
</script>

<style scoped>
.periods-container {
  padding: 0 0 2rem 10rem;
}

.labelStyle {
  font-size: 2.4rem;
  color: '#333';
}

.selectStyle {
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 1.6rem;
  cursor: pointer;
  width: 8rem;
  background-color: transparent;
}

.shifts-dropdown {
  width: 30rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
