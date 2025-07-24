<script setup lang="ts">
  import { computed } from 'vue';
  import type { TimerOptionKey } from '@/types/timer.ts';

  const progress = defineModel<number>('progress', { required: true });
  const timerVariant = defineModel<TimerOptionKey>('timer-variant', { required: true });
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = computed(() => circumference * (1 - progress.value));
</script>

<template>
  <svg width="260" height="260" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Фоновое кольцо -->
    <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="12" />

    <!-- Кольцо прогресса -->
    <circle
      :class="[$style.circle, $style[timerVariant]]"
      cx="60"
      cy="60"
      r="54"
      fill="none"
      stroke="#ff6347"
      stroke-width="12"
      stroke-linecap="round"
      stroke-dasharray="339.292"
      :stroke-dashoffset="dashoffset"
      transform="rotate(-90 60 60)"
    />
  </svg>
</template>

<style module>
  .circle {
    transition: stroke-dashoffset 0.7s ease-in-out;
  }
  .focus {
    stroke: #ff6347;
  }

  .shortPause {
    stroke: #4caf50;
  }

  .longPause {
    stroke: #1e88e5;
  }
</style>
