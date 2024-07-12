<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    checkLoginStatus() {
      if (this.isLoggedIn) {
        this.$router.push({ name: 'Main' });
      } else {
        this.$router.push({ name: 'Auth' });
      }
    },
  },
  created() {
    this.$store.dispatch('tryLogin');
    this.checkLoginStatus();
  },
  watch: {
    isLoggedIn() {
      this.checkLoginStatus();
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  font-family: sans-serif;
  background-color: #fdf2e9;
}
</style>
