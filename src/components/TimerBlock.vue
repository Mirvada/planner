<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { RotateCcw } from 'lucide-vue-next';
  import DurationController from '@/components/DurationController.vue';

  const { stepTime } = defineProps({
    stepTime: {
      type: Number,
      required: true,
    },
  });

  const initialDuration = defineModel<number>('initial-duration', { required: true });
  const variantTimer = defineModel<string>('variant-timer', { required: true });

  const remainingTime = ref<number | null>(null);
  const hours = ref<number>(0);
  const minutes = ref<number>(initialDuration.value);
  const seconds = ref<number>(0);
  const stopTime = ref<number | null>(null);
  const pausedTime = ref<number | null>(null);
  const timerId = ref<number | undefined>(undefined);
  const isRunning = computed(() => timerId.value !== undefined);
  const buttonDisabled = computed(() => initialDuration.value <= 5);
  const audio = new Audio('public/audio/clock-beep.mp3');

  const convertMinutesToMS = (minute: number) => minute * 60 * 1000;
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  const resetTimer = (min: number) => {
    clearInterval(timerId.value);
    hours.value = 0;
    minutes.value = min;
    seconds.value = 0;
    remainingTime.value = null;
    stopTime.value = null;
    timerId.value = undefined;
  };

  const updateDisplayTime = () => {
    if (remainingTime.value !== null) {
      hours.value = Math.floor((remainingTime.value / (1000 * 60 * 60)) % 24);
      minutes.value = Math.floor((remainingTime.value % (1000 * 60 * 60)) / (1000 * 60));
      seconds.value = Math.floor((remainingTime.value % (1000 * 60)) / 1000);
    }
  };

  const stopTimer = () => {
    if (timerId.value !== undefined && stopTime.value !== null) {
      clearInterval(timerId.value);
      timerId.value = undefined;
      pausedTime.value = stopTime.value - Date.now();
    }
  };

  const countdown = () => {
    if (isRunning.value) return;
    if (pausedTime.value) {
      stopTime.value = Date.now() + pausedTime.value;
      pausedTime.value = null;
    } else {
      stopTime.value = Date.now() + convertMinutesToMS(initialDuration.value);
    }

    timerId.value = setInterval(() => {
      if (stopTime.value !== null) {
        remainingTime.value = stopTime.value - Date.now();
      }

      updateDisplayTime();

      if (remainingTime.value <= 0 && timerId.value !== undefined) {
        audio.play();
        hours.value = 0;
        minutes.value = 0;
        seconds.value = 0;
        setTimeout(() => {
          resetTimer(initialDuration.value);
        }, 3000);
      }
    }, 500);
  };

  watch(
    () => initialDuration.value,
    (newValue) => {
      if (isRunning.value) return;
      resetTimer(newValue);
    }
  );

  watch(
    () => variantTimer.value,
    (newValue, oldValue) => {
      if (oldValue !== newValue) {
        resetTimer(initialDuration.value);
      }
    }
  );
</script>

<template>
  <div :class="$style.timerBlock">
    <div :class="$style.iconWrapper" @click="resetTimer(initialDuration)">
      <RotateCcw :class="$style.iconReset" />
    </div>
    <span :class="$style.time">{{
      `${formatTime(hours)} : ${formatTime(minutes)} : ${formatTime(seconds)}`
    }}</span>
    <div :class="$style.wrapper">
      <DurationController
        operator="+"
        :stepTime="stepTime"
        v-model:initial-duration="initialDuration"
        v-model:is-running="isRunning"
        v-model:stop-time="stopTime"
        v-model:paused-time="pausedTime"
        v-model:remaining-time="remainingTime"
        @update-display="updateDisplayTime"
      />
      <button :class="$style.buttonStartStop" @click="countdown" v-if="!isRunning">Старт</button>
      <button :class="$style.buttonStartStop" @click="stopTimer" v-else>Стоп</button>
      <DurationController
        operator="-"
        :stepTime="stepTime"
        :button-disabled="buttonDisabled"
        v-model:initial-duration="initialDuration"
        v-model:is-running="isRunning"
        v-model:stop-time="stopTime"
        v-model:paused-time="pausedTime"
        v-model:remaining-time="remainingTime"
        @update-display="updateDisplayTime"
      />
    </div>
  </div>
</template>

<style module>
  .timerBlock {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .time {
    font-size: 52px;
  }

  .iconWrapper {
    padding: 8px;
    display: block;
    position: absolute;
    top: -77px;
    right: -42px;
    border-radius: 10px;
    cursor: pointer;
  }

  .iconWrapper:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .iconReset {
    width: 24px;
    height: 24px;
    display: block;
  }

  .wrapper {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .buttonStartStop {
    padding: 7px 12px;
    width: 110px;
    font-size: 24px;
    text-transform: uppercase;
    border-radius: 10px;
  }

  .buttonStartStop:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
