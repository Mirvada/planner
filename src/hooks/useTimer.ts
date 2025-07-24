import { computed, nextTick, type Ref, ref } from 'vue';
import { updateDisplayTime } from '@/lib/updateDisplayTime.ts';
import { convertMinutesToMS } from '@/lib/convertMinutesToMS.ts';
import type { TimerOptionKey } from '@/types/timer.ts';

export function useTimer(
  initialDuration: Ref<number>,
  timerVariant: Ref<TimerOptionKey>,
  workSessionsBeforeBreak: Ref<number>,
  stepTime: Ref<number>
) {
  const remainingTime = ref<number | null>(null);
  const stopTime = ref<number | null>(null);
  const pausedTime = ref<number | null>(null);
  const timerId = ref<number | undefined>(undefined);
  const countRound = ref<number>(0);
  const minutes = ref<number>(initialDuration.value);
  const seconds = ref<number>(0);
  const isRunning = computed(() => timerId.value !== undefined);

  const progress = computed(() => {
    if (!remainingTime.value || !initialDuration.value) return 0;
    return 1 - remainingTime.value / convertMinutesToMS(initialDuration.value);
  });

  const switchTimerModes = () => {
    if (timerVariant.value === 'focus' && countRound.value === workSessionsBeforeBreak.value) {
      timerVariant.value = 'longPause';
      countRound.value = 0;
    } else if (timerVariant.value === 'focus') {
      timerVariant.value = 'shortPause';
    } else if (timerVariant.value === 'shortPause') {
      timerVariant.value = 'focus';
    } else {
      timerVariant.value = 'focus';
    }

    nextTick(() => start());
  };

  const sumAndSubtract = (operator: string) => {
    const delta = operator === '+' ? 1 : -1;
    const newDuration = initialDuration.value + stepTime.value * delta;

    if (newDuration < 1) return;

    initialDuration.value = newDuration;

    if (isRunning.value && stopTime.value !== null) {
      stopTime.value += convertMinutesToMS(stepTime.value) * delta;
    } else if (pausedTime.value !== null) {
      pausedTime.value += convertMinutesToMS(stepTime.value) * delta;
      remainingTime.value = pausedTime.value;
    } else {
      const newStopTime = Date.now() + convertMinutesToMS(newDuration);
      stopTime.value = newStopTime;
      remainingTime.value = newStopTime - Date.now();
    }

    updateDisplayTime(remainingTime, minutes, seconds);
  };

  const reset = () => {
    clearInterval(timerId.value);
    timerId.value = undefined;
    stopTime.value = null;
    remainingTime.value = null;
    minutes.value = initialDuration.value;
    seconds.value = 0;
  };

  const stop = () => {
    if (timerId.value !== undefined && stopTime.value !== null) {
      clearInterval(timerId.value);
      timerId.value = undefined;
      pausedTime.value = stopTime.value - Date.now();
    }
  };

  const start = () => {
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

      updateDisplayTime(remainingTime, minutes, seconds);

      if (remainingTime.value <= 0 && timerId.value !== undefined) {
        clearInterval(timerId.value);
        timerId.value = undefined;

        remainingTime.value = 0;
        updateDisplayTime(remainingTime, minutes, seconds);

        const audio = new Audio('audio/clock-beep.mp3');
        audio.play();

        if (timerVariant.value === 'focus') {
          countRound.value++;
        }
        setTimeout(() => {
          reset();
          switchTimerModes();
        }, 1700);
      }
    }, 500);
  };

  return {
    start,
    stop,
    reset,
    sumAndSubtract,
    remainingTime,
    minutes,
    seconds,
    progress,
    isRunning,
  };
}
