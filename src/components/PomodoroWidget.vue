<script setup lang="ts">
  import { ref } from 'vue';
  import TimerBlock from '@/components/TimerBlock.vue';

  const typeTimer = ref([
    {
      minute: 1,
      nameRu: 'Помодоро',
      nameEn: 'pomodoro',
    },
    {
      minute: 5,
      nameRu: 'Перерыв',
      nameEn: 'shortPause',
    },
    {
      minute: 30,
      nameRu: 'Отдых',
      nameEn: 'longPause',
    },
  ]);
  const variantTimer = ref<string>(typeTimer.value[0].nameEn);
  const initialDuration = ref<number>(typeTimer.value[0].minute);
  const isActive = ref<string>('pomodoro');
  const stepTime = 5;

  const setTimerOption = (variant: number) => {
    initialDuration.value = typeTimer.value[variant].minute;
    variantTimer.value = typeTimer.value[variant].nameEn;
    isActive.value = typeTimer.value[variant].nameEn;
  };

  const colorTheme = () => variantTimer.value;
</script>

<template>
  <div :class="[$style[colorTheme()], $style.timers]">
    <div>
      <button
        v-for="(type, index) in typeTimer"
        :key="type.nameEn"
        :class="[isActive === type.nameEn ? $style.active : '', $style.button]"
        @click="setTimerOption(index)"
      >
        {{ type.nameRu }}
      </button>
    </div>
    <div>
      <TimerBlock
        v-model:initial-duration="initialDuration"
        v-model:variant-timer="variantTimer"
        :step-time="stepTime"
      />
    </div>
  </div>
</template>

<style module>
  .timers {
    padding: 40px 10px 20px;
    width: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #ffffff;
    font-size: 24px;
    transition: background-color 0.4s ease-in-out;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  .pomodoro {
    background-color: #d95550;
  }

  .shortPause {
    background-color: #4caf50;
  }

  .longPause {
    background-color: #397097;
  }

  .button {
    padding: 7px 12px;
    border-radius: 10px;
    cursor: pointer;
  }

  .active {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .button:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
</style>
