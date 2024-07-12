<template>
  <div :disabled="isLoading" class="buttons-container">
    <shift-button :color="isOnShift ? 'red' : 'blue'" @click="toggleShift" :disabled="isOnBreak || isLoading"
      >{{ btnShiftCaption }} Shift</shift-button
    >
    <shift-button :color="isOnBreak ? 'red' : 'blue'" @click="toggleBreak" :disabled="!isOnShift || isLoading"
      >{{ btnBreakCaption }} Break</shift-button
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ShiftButton from '@/components/ShiftButton.vue';

export default {
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  components: {
    ShiftButton,
  },
  computed: {
    ...mapGetters(['isOnShift', 'isOnBreak']),
    btnShiftCaption() {
      return this.isOnShift ? 'End' : 'Start';
    },
    btnBreakCaption() {
      return this.isOnBreak ? 'End' : 'Start';
    },
  },
  methods: {
    ...mapActions(['startShift', 'endShift', 'startBreak', 'endBreak']),
    async toggleBreak() {
      if (this.isOnBreak) {
        await this.runAction(this.endBreak);
      } else {
        await this.runAction(this.startBreak);
      }
    },
    async toggleShift() {
      if (this.isOnShift) {
        await this.runAction(this.endShift);
      } else {
        await this.runAction(this.startShift);
      }
    },
    async runAction(func) {
      this.isLoading = true;
      try {
        await func();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.buttons-container {
  display: flex;
  gap: 10px;
  margin-right: 2rem;
}
</style>
