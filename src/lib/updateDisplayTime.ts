import type { Ref } from 'vue';

export const updateDisplayTime = (
  remainingTime: Ref<number | null>,
  minutes: Ref<number>,
  seconds: Ref<number>
) => {
  if (remainingTime.value !== null) {
    minutes.value = Math.floor(remainingTime.value / (1000 * 60));
    seconds.value = Math.floor((remainingTime.value % (1000 * 60)) / 1000);
  }
};
