<template>
  <div class="main-container">
    <nav-component></nav-component>
    <header-component></header-component>
    <periods-component></periods-component>
    <shifts-list></shifts-list>
  </div>
</template>

<script>
import NavComponent from '@/components/NavComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import PeriodsComponent from '@/components/PeriodsComponent.vue';
import ShiftsList from '@/components/shifts/ShiftsList.vue';

export default {
  components: { HeaderComponent, PeriodsComponent, ShiftsList, NavComponent },
};
</script>

<style scoped>
.main-container {
  width: 70%;
  margin: 0 auto;
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #fff;
}
</style>
