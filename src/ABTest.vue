<script setup lang="ts">
  const props = defineProps<{
    name: string,
    chance: number
  }>();
  const slots = defineSlots<{
    default(): any
  }>();
</script>

<template>
  <slot />
</template>
