<script lang="ts">
  export default {
    name: 'ABTest'
  }
</script>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    name: string,
    chance?: number
  }>(), {
    chance: 1
  });
  const slots = defineSlots<{
    default(): any
  }>();
</script>

<template>
  <slot />
</template>
