<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import ProgressRing from '@/components/ProgressRing.vue';
  import MyButton from '@/components/ui/MyButton.vue';
  import { useTimer } from '@/hooks/useTimer.ts';
  import TimerControl from '@/components/TimerControl.vue';
  import type { TimerOptionKey } from '@/types/timer.ts';

  interface TimerOption {
    minute: number;
    nameRu: string;
    nameEn: string;
  }

  const timerOptions = ref<Record<TimerOptionKey, TimerOption>>({
    focus: {
      minute: 25,
      nameRu: 'Фокус',
      nameEn: 'focus',
    },
    shortPause: {
      minute: 5,
      nameRu: 'Короткий перерыв',
      nameEn: 'shortPause',
    },
    longPause: {
      minute: 20,
      nameRu: 'Длинный перерыв',
      nameEn: 'longPause',
    },
  });

  const timerVariant = ref<TimerOptionKey>('focus');
  const currentTimerVariant = computed(() => timerOptions.value[timerVariant.value]);
  const initialDuration = ref<number>(currentTimerVariant.value.minute);
  const workSessionsBeforeBreak = ref<number>(2);
  const stepTime = ref<number>(5);
  const timeFormatter = (time: number) => time.toString().padStart(2, '0');
  const {
    start,
    stop,
    reset,
    sumAndSubtract,
    minutes,
    seconds,
    remainingTime,
    progress,
    isRunning,
  } = useTimer(initialDuration, timerVariant, workSessionsBeforeBreak, stepTime);

  if (remainingTime.value === null) {
    remainingTime.value = 0;
  }

  watch(
    () => timerVariant.value,
    (oldValue, newValue) => {
      if (oldValue !== newValue) {
        initialDuration.value = currentTimerVariant.value.minute;
        reset();
      }
    }
  );
</script>

<template>
  <div :class="$style.pomodoro">
    <div>
      <my-button @click="() => (timerVariant = 'focus')">Фокус</my-button>
      <my-button @click="() => (timerVariant = 'shortPause')">Короткий перерыв</my-button>
      <my-button @click="() => (timerVariant = 'longPause')">Длинный перерыв</my-button>
    </div>
    <div :class="$style.container">
      <span :class="$style.nameTimer">{{ currentTimerVariant.nameRu }}</span>
      <div :class="$style.buttonControlTimerContainer">
        <TimerControl
          @start-timer="start"
          @stop-timer="stop"
          @sum-and-subtract="sumAndSubtract"
          :is-running="isRunning"
        />
      </div>

      <span :class="$style.time">
        {{ `${timeFormatter(minutes)} : ${timeFormatter(seconds)}` }}
      </span>
    </div>
    <ProgressRing :progress="progress" :timer-variant="timerVariant" />
  </div>
</template>

<style module>
  .pomodoro {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .nameTimer {
    width: 150px;
    height: 60px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }

  .buttonControlTimerContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .time {
    font-size: 1.25rem;
  }
</style>
