<script setup lang="ts">
  import { Plus, Minus } from 'lucide-vue-next';
  import { convertMinutesToMS } from '@/lib/convertMinutesToMS.ts';
  const { operator, stepTime, buttonDisabled } = defineProps({
    operator: {
      type: String,
      required: true,
    },
    stepTime: {
      type: Number,
      required: true,
    },
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
  });

  const initialDuration = defineModel<number>('initial-duration', { required: true });
  const isRunning = defineModel<boolean>('is-running', { required: true });
  const stopTime = defineModel<number | null>('stop-time', { required: true });
  const pausedTime = defineModel<number | null>('paused-time', { required: true });
  const remainingTime = defineModel<number | null>('remaining-time', { required: true });

  const emit = defineEmits(['update-display']);

  const sumAndSubtract = (operator: string) => {
    const delta = operator === '+' ? 1 : -1;
    const newDuration = initialDuration.value + stepTime * delta;

    if (newDuration < 1) return;

    initialDuration.value = newDuration;

    if (isRunning.value && stopTime.value !== null) {
      stopTime.value += convertMinutesToMS(stepTime) * delta;
    } else if (pausedTime.value !== null) {
      pausedTime.value += convertMinutesToMS(stepTime) * delta;
      remainingTime.value = pausedTime.value;
    } else {
      const newStopTime = Date.now() + convertMinutesToMS(newDuration);
      stopTime.value = newStopTime;
      remainingTime.value = newStopTime - Date.now();
    }

    emit('update-display', newDuration);
  };
</script>

<template>
  <button :class="$style.button" @click="sumAndSubtract(operator)" :disabled="buttonDisabled">
    <Plus :class="$style.icon" v-if="operator === '+'" />
    <Minus :class="$style.icon" v-else />
  </button>
</template>

<style module>
  .button {
    padding: 8px;
    display: block;
    border-radius: 10px;
    cursor: pointer;
  }
  .icon {
    display: block;
  }

  .button:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
