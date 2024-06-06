<script setup lang="ts">
  import { useVariant } from './useVariant';
  import { VNode } from 'vue';
  import type { Variant } from "types/Variant";
  
  /* const props = defineProps<{
    variant?: string
  }>(); */
  const emit = defineEmits<{
    selected: [name: string]
  }>();
  const slots = defineSlots();
  let render = () => null;

  const getVariant = <T>() => {
    if (!slots.default) {
      return null;
    }

    const sl: Variant<T>[] = [];
    for (const slot of slots.default()) {
      if (slot.type.__name !== 'ABTest') {
        continue;
      }
      sl.push({
        name: slot.props.name,
        chance: parseInt(slot.props.chance),
        data: slot
      });
    }

    return useVariant(sl);
  };

  const variant = getVariant<VNode>();

  if (variant !== null) {
    emit('selected', variant.name);
    render = () => (variant.data.children as Record<string, any>).default();
  }
</script>

<template>
  <render />
</template>