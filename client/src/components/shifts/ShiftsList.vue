<template>
  <div class="shits-container">
    <p v-if="isLoading">Loading...</p>
    <div v-else class="shifts-list">
      <shift-item v-for="shift in shifts" :key="shift.shift_id" :shift="shift" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ShiftItem from './ShiftItem.vue';

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  components: { ShiftItem },
  computed: mapGetters(['shifts']),
  methods: {
    ...mapActions(['fetchShifts']),
    async getShifts() {
      this.isLoading = true;
      try {
        await this.fetchShifts({ period: 'day' });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.getShifts();
  },
};
</script>

<style scoped>
.shits-container {
  padding: 0 9rem 2rem 10rem;
}

.shifts-list {
  padding-top: 2rem;
}
h2 {
  margin-bottom: 1rem;
}
</style>
