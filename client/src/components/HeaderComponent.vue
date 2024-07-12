<template>
  <header>
    <div class="logo-container">
      <img src="../assets/logo.png" :alt="companyName" class="logo" />
      <h1>{{ companyName }}</h1>
    </div>
    <shift-buttons></shift-buttons>
  </header>
</template>

<script>
import ShiftButtons from './ShiftButtons.vue';
export default {
  components: { ShiftButtons },
  props: ['companyName', 'logo'],
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7.6rem;
}
.logo-container {
  display: flex;
  align-items: center;
}
.logo {
  width: 35rem;
  height: 25rem;
}
</style>
