<script setup lang="ts">
  import PomodoroWidget from '@/components/PomodoroWidget.vue';
</script>

<template>
  <PomodoroWidget />
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  button {
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: inherit;
    cursor: pointer;
  }
</style>
