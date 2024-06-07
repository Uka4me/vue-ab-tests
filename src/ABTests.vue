<script setup lang="ts">
  import { useVariant } from './useVariant';
  import type { VNode } from 'vue';
  import type { Variant } from "./types/Variant";
  import { StorageFabric, StorageType } from './storage';

  const props = withDefaults(defineProps<{
    name: string,
    storage?: StorageType,
    expire?: number
  }>(), {
    storage: StorageType.LocalStorage,
    expire: 30
  });

  const emit = defineEmits<{
    selected: [name: string],
    reselected: [name: string]
  }>();
  const slots = defineSlots();
  let render = () => null;

  const vnodesToVatiants = <T>(vnodes: VNode[]): { [key: string]: Variant<T> } => {
    // TODO: Correct the type for VNode, because doesn't see the "name" property
    return vnodes
      .filter((slot) => (slot.type as any).name === 'ABTest')
      .reduce((arr, slot) => {
        const name = slot.props?.name as string;
        arr[name] = {
          name,
          chance: parseInt(slot.props?.chance),
          data: slot
        } as Variant<T>;

        return arr;
      }, {} as { [key: string]: Variant<T> })
  }

  const getVariant = <T>() => {

    if (!slots.default) {
      return null;
    }

    const sl = vnodesToVatiants<T>(slots.default());

    const storage = StorageFabric.getStorage(props.storage);
    let variantName = storage.getItem(props.name);
    if (variantName) {
      emit('reselected', variantName);
      return sl[variantName];
    }

    const variant = useVariant(Object.values(sl));

    if (variant) {
      storage.setItem(props.name, variant.name, props.expire);
      emit('selected', variant.name);
    }

    return variant;
  };

  const variant = getVariant<VNode>();

  if (variant !== null) {
    render = () => (variant.data.children as Record<string, any>).default();
  }
</script>

<template>
  <render />
</template>