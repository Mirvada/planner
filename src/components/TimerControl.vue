<script setup lang="ts">
  import MyButton from '@/components/ui/MyButton.vue';

  defineModel('isRunning', { required: true });

  defineEmits<{
    startTimer: [];
    stopTimer: [];
    sumAndSubtract: [value: string];
  }>();
</script>

<template>
  <MyButton @click="$emit('sumAndSubtract', '+')" variantIcon="increase" sizeIcon="iconS" />
  <MyButton @click="$emit('startTimer')" v-if="!isRunning" variantIcon="start" sizeIcon="iconXL" />
  <MyButton @click="$emit('stopTimer')" v-else variant-icon="stop" sizeIcon="iconXL" />
  <MyButton @click="$emit('sumAndSubtract', '-')" variantIcon="decrease" sizeIcon="iconS" />
</template>
