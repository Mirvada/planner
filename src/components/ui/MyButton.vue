<script setup lang="ts">
  import { computed } from 'vue';
  import { Power, Pause, Plus, Minus, StepForward, TimerReset } from 'lucide-vue-next';

  type ButtonVariantIcon = 'start' | 'stop' | 'increase' | 'decrease' | 'switchMode' | 'reset';
  type ButtonSizeIcon = 'iconXS' | 'iconS' | 'iconM' | 'iconXL';

  interface Props {
    variantIcon?: ButtonVariantIcon;
    sizeIcon?: ButtonSizeIcon;
  }
  const props = defineProps<Props>();

  const buttonIcon = {
    start: Power,
    stop: Pause,
    increase: Plus,
    decrease: Minus,
    switchMode: StepForward,
    reset: TimerReset,
  };

  const sizeIcon = computed(() => {
    return !props.sizeIcon ? '' : props.sizeIcon;
  });

  const variantIcon = computed(() => {
    return !props.variantIcon ? null : buttonIcon[props.variantIcon];
  });
</script>

<template>
  <button :class="$style.button">
    <slot></slot>
    <component
      :is="variantIcon"
      :class="[$style.icon, $style[sizeIcon]]"
      :alt="props.variantIcon"
    />
  </button>
</template>

<style module>
  .button {
    padding: 8px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  .icon {
    display: block;
  }

  .iconXS {
    width: 24px;
    height: 24px;
  }

  .iconS {
    width: 32px;
    height: 32px;
  }

  .iconM {
    width: 48px;
    height: 48px;
  }

  .iconXL {
    width: 72px;
    height: 72px;
  }
</style>
