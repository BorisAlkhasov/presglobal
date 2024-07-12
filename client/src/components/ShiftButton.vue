<template>
  <button
    :class="['base-button', `base-button--${color}`, { 'base-button--disabled': disabled }]"
    :style="buttonStyle"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    color: {
      type: String,
      default: 'default',
    },
    width: {
      type: String,
      default: '200px',
    },
    height: {
      type: String,
      default: '50px',
    },
    borderRadius: {
      type: String,
      default: '10px',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonStyle() {
      return {
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius,
      };
    },
  },
};
</script>

<style scoped>
.base-button {
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s, background-color 0.3s;
}

.base-button:hover:not(.base-button--disabled) {
  opacity: 0.8;
}

.base-button--default {
  background-color: #ccc;
}

.base-button--red {
  background-color: #ff0000;
}

.base-button--blue {
  background-color: #0000ff;
}

.base-button--disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
  opacity: 0.6;
}

.base-button--disabled:hover {
  opacity: 0.6;
}
</style>
