<template>
  <ABTests @selected="selected">
    <ABTest name="A" :chance="2">
      Test A
    </ABTest>
    <ABTest name="B" :chance="1">
      Test B
    </ABTest>
  </ABTests>
</template>

<script setup lang="ts">
  import ABTests from './ABTests.vue';
  import ABTest from './ABTest.vue';

  const selected = (name: string) => {
    console.log('selected', name);
  }
</script>
