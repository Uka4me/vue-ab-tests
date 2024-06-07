# vue-ab-tests

Package for A/B testing of the site and components

## Install

```bash
npm install vue-ab-tests
```

## Usage

### Plugin registration:

```js
import { createApp } from 'vue'
import { ABTestPlugin } from 'vue-ab-tests';

createApp(App)
  .use(ABTestPlugin)
  .mount('#app')
```

When connecting globally, the `ab-tests` and `ab-test` components will be available.

### Importing components:

```js
import { ABTests, ABTest } from 'vue-ab-tests';
```

The `ABTests` component is a group of tests. The tests themselves must be located inside, in the form of an `ABTest` component, otherwise they will be ignored.

## Example

```html
<template>
  <ABTests name="ab-tests" :storage="StorageType.Cookie">
    <ABTest name="test-1" :chance="2">
      <h1>Test 1</h1>
      <p>Test 1 content</p> 
    </ABTest>
    <ABTest name="test-2" :chance="1">
      <h1>Test 2</h1>
      <p>Test 2 content</p> 
    </ABTest> 
  </ABTests>
</template>

<script setup lang="ts"> 
import { ABTests, ABTest, StorageType } from 'vue-ab-tests';
</script>
```

In this example, two tests are created, `test-1` has priority `2`, and `test-2` has priority `1`. In this case, `test-1` has approximately `66%` chance of being shown, and `test-2` has approximately `34%`.

## Docs

### ABTests

#### Props

* `name: string` - The name of the group of tests.
* `storage?: StorageType` - *(default: `StorageType.LocalStorage`)* The storage type.
* `expire?: number` - *(default: 30)* The expiration time in days.

#### Slots

* `default: ABTest[]`

#### Events

* `selected: (name: string) => void` - Called when a variant is selected.
* `reselected: (name: string) => void` - Called when a variant is reselected. When this event was called, the selection of the component was based on the user's saved data after the very first impression.

```html
<template>
  <ABTests @selected="selected">
    <ABTest name="test-1" :chance="2">
      ...
    </ABTest>
    <ABTest name="test-2" :chance="1">
      ...
    </ABTest> 
  </ABTests>
</template>

<script setup lang="ts">
  import { ABTests, ABTest } from 'vue-ab-tests';

  const selected = (name: string) => {
    console.log(name)
  }
</script>
```

### ABTest

#### Props

* `name: string` - The name of the variant.
* `chance?: number` - *(default: 1)* The chance of the variant being selected.

#### Slots

* `default: any`

### useVariant

Returns a random variant from the given array of variants based on their chance.

 * `variants: Variant<T>[]`  - An array of variants.
    - `Variant.name: string` - The name of the variant.
    - `Variant.chance: number` - The chance of the variant being selected.
    - `Variant.data: T` - The data associated with the variant.
 * `@return {Variant<T> | null}` - A random variant from the given array or null if the array is empty.

```ts
import { useVariant } from 'vue-ab-tests';
import type { Variant } from 'vue-ab-tests';

const variants: Variant<string>[] = [
  {
    name: "test-1",
    chance: 2,
    data: "Test 1"
  },
  {
    name: "test-2",
    chance: 1,
    data: "Test 2"
  }
];
const result = useVariant(variants);

console.log(result.name)
```