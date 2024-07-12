<template>
  <div class="login-container">
    <div class="login-form">
      <h2>{{ mode === 'login' ? 'Login' : 'Signup' }} Form</h2>
      <p v-if="error" class="error">{{ error }}</p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input type="number" v-model.trim="idNumber" placeholder="ID Number" required />
        </div>
        <div class="form-group">
          <input type="password" v-model.trim="password" placeholder="Password" required />
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Submitting' : submitCaption }}
        </button>
      </form>
      <p class="signup-link">
        {{ pCaption }} <button type="button" class="signup-button" @click="switchMode">{{ signupCaption }}</button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idNumber: '',
      password: '',
      isValid: true,
      mode: 'login',
      error: null,
      isLoading: null,
    };
  },
  computed: {
    submitCaption() {
      if (this.mode === 'login') {
        return 'Login';
      }
      return 'Signup';
    },
    signupCaption() {
      if (this.mode === 'login') {
        return 'Signup now';
      }
      return 'Login now';
    },
    pCaption() {
      if (this.mode === 'login') {
        return 'Not a member?';
      }
      return 'Already a member?';
    },
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      try {
        await this.$store.dispatch(this.mode, {
          idNumber: this.idNumber,
          password: this.password,
        });
      } catch (error) {
        this.error = error.message;
      }
      this.isLoading = false;
    },
    switchMode() {
      this.mode = this.mode === 'login' ? 'signup' : 'login';
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 50rem;
  height: 30rem;
  margin: 20rem auto;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.6rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.6rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.login-button:hover {
  opacity: 0.9;
}

.signup-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 1.4rem;
  color: #333;
}

.signup-button {
  border: none;
  color: #667eea;
  background-color: transparent;
  cursor: pointer;
  font-size: 1.4rem;
}

p.error {
  text-align: center;
  color: #333;
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
}
</style>
