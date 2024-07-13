<template>
  <div class="shift-item" @click="toggleExpand">
    <div class="title">
      <p>{{ shift.shift_date }}</p>
      <div class="title-times-container">
        <p class="text-start">{{ shift.start_time }}</p>
        <p class="text-end">{{ getEndShiftTime }}</p>
      </div>
    </div>
    <span class="expand-icon" :class="{ rotate: isExpanded }">▼</span>
  </div>
  <transition name="expand">
    <div v-if="isExpanded" class="shift-data-container">
      <div class="shift-comment">
        <textarea
          name="comment"
          id="comment"
          placeholder="Enter your comment here"
          v-model="comment"
          class="comment"
          :disabled="isLoading"
        ></textarea>
        <button class="btn-comment" @click="onAddComment(shift.shift_id)" :disabled="isLoading">Add Comment</button>
      </div>
      <div class="shift-breaks">
        <p class="breaks-title">Breaks</p>
        <ul v-if="shift.breaks && shift.breaks.length > 0">
          <li v-for="break_item in shift.breaks" :key="break_item.break_id">
            <div class="break-times">
              <span v-if="break_item.start_time" class="break-text-start text-start"
                >Started at {{ break_item.start_time }}</span
              >
              <span v-if="break_item.end_time" class="break-text-end text-end">Ended at {{ break_item.end_time }}</span>
            </div>
          </li>
        </ul>
        <p v-else class="text-start">No breaks</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      isExpanded: false,
      comment: null,
      isLoading: false,
    };
  },
  props: ['shift'],
  computed: {
    getEndShiftTime() {
      if (this.shift.end_time) {
        return this.shift.end_time;
      }
      return 'Ongoing';
    },
  },
  methods: {
    ...mapActions(['addComment']),
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    async onAddComment(shift_id) {
      this.isLoading = true;
      try {
        await this.addComment({
          shift_id,
          comment: this.comment,
        });
      } catch (error) {
        alert('An error occured while adding comment.');
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    if (this.shift.comment) {
      this.comment = this.shift.comment;
    }
  },
};
</script>

<style scoped>
.shift-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #777;
  border-radius: 10px;
  margin-bottom: 1rem;
  cursor: pointer;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
}

.text-start {
  color: #0000ff;
}

.text-end {
  color: #ff0000;
}

.title-times-container {
  margin-left: 3.2rem;
  width: 35rem;
  display: flex;
  gap: 4rem;
}

.expand-icon {
  font-size: 1.4rem;
  color: #555;
  transition: transform 0.3s ease;
}

.expand-icon.rotate {
  transform: rotate(180deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s, opacity 0.3s;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.shift-data-container {
  margin-left: 3.2rem;
  margin-bottom: 1.8rem;
  display: flex;
  gap: 5rem;
}

.comment {
  display: block;
  border-radius: 5px;
  margin-bottom: 1.4rem;
  width: 30rem;
  height: 10rem;
}

.btn-comment {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #0000ff;
  cursor: pointer;
  transition: opacity 0.3s, background-color 0.3s;
}

.btn-comment:hover {
  opacity: 0.8;
}

ul {
  list-style-type: none;
}

.shift-breaks {
  font-size: 1.8rem;
}

.breaks-title {
  font-weight: 600;
  margin-bottom: 1rem;
}

.break-times {
  display: flex;
  gap: 6.4rem;
  padding: 1rem 2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 0.8rem;
}
</style>
