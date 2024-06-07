import { expect, test, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ABTestPlugin, useVariant, Variant } from '../src';

const originalMathRandom = Math.random;

test('Test rendering', () => {
  Math.random = vi.fn(() => 0.7);

  const Component = {
    template: `
      <ab-tests name="Test rendering">
        <ab-test name="A" chance="2">
          Test A
        </ab-test>
        <ab-test name="B" chance="1">
          Test B
        </ab-test>
      </ab-tests>
    `,
  }

  const wrapper = mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })
  
  expect(wrapper.text()).toBe('Test B')
})

test('Only ABTest component rendering', () => {
  Math.random = vi.fn(() => 0.1);

  const Component = {
    template: `
      <ab-tests name="Only ABTest component rendering">
        <ab-test name="A" chance="2">
          Test A
        </ab-test>
        <ab-test name="B" chance="1">
          Test B
        </ab-test>
        <div name="C" chance="3">Not Rendered</div>
        <p name="D" chance="4">Not Rendered</p>
      </ab-tests>
    `,
  }

  const wrapper = mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })
  
  expect(wrapper.text()).toBe('Test A')
})

test('Empty ABTests', () => {
  Math.random = vi.fn(() => 0.1);

  const Component = {
    template: `
      <ab-tests name="Empty ABTests">
      </ab-tests>
    `,
  }

  const wrapper = mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })
  
  expect(wrapper.html()).toBe('')
})

test('Missing ABTest component', () => {
  Math.random = vi.fn(() => 0.1);

  const Component = {
    template: `
      <ab-tests name="Missing ABTest component">
        <div name="C" chance="3">Not Rendered</div>
        <p name="D" chance="4">Not Rendered</p>
      </ab-tests>
    `,
  }

  const wrapper = mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })
  
  expect(wrapper.html()).toBe('')
})

test('Calling the inverse function after selection', () => {
  Math.random = vi.fn(() => 0.7);

  let variant: string | null = null;
  const Component = {
    template: `
      <ab-tests name="Calling the inverse function after selection" @selected="selected">
        <ab-test name="A" chance="2">
          Test A
        </ab-test>
        <ab-test name="B" chance="1">
          Test B
        </ab-test>
      </ab-tests>
    `,
    methods: {
      selected: (name: string) => {
        variant = name;
      }
    }
  }

  mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })
  
  expect(variant).toBe('B')
})

test('Checking module spawn distribution', () => {
  Math.random = originalMathRandom;
  const repeat = 10_000;
  const deviation = 0;
  const statistic = {
    'Test A': 0,
    'Test B': 0,
    'Test C': 0
  }

  const variants = [
    { name: 'A', chance: 2, data: 'Test A' },
    { name: 'B', chance: 1, data: 'Test B' },
    { name: 'C', chance: 3, data: 'Test C' }
  ];

  let variant: Variant<string> | null = null;
  for (let i=0; i<repeat; i++) {
    variant = useVariant<string>(variants);

    if (variant !== null) {
      statistic[variant.data]++;
    }
  }

  for (let key in statistic) {
    statistic[key] = Math.floor(statistic[key] / repeat * 100);
  }
  
  expect(statistic['Test A']).toBeLessThanOrEqual(34 + deviation);
  expect(statistic['Test B']).toBeLessThanOrEqual(17 + deviation);
  expect(statistic['Test C']).toBeLessThanOrEqual(49 + deviation);
})

test('Test storage: localstorage', () => {
  Math.random = originalMathRandom;
  const repeat = 20;

  const Component = {
    template: `
      <ab-tests name="Test storage: localstorage" storage="localstorage" :expire="1">
        <ab-test name="A" chance="2">
          Test A
        </ab-test>
        <ab-test name="B" chance="1">
          Test B
        </ab-test>
      </ab-tests>
    `,
  }

  let wrapper = mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })

  const first = wrapper.text();

  for (let i=0; i<repeat; i++) {
    wrapper = mount(Component, {
      global: {
        plugins: [ ABTestPlugin ]
      }
    })

    expect(wrapper.text()).toBe(first)
  }
})

test('Test storage: cookie', () => {
  Math.random = originalMathRandom;
  const repeat = 20;

  const Component = {
    template: `
      <ab-tests name="Test storage: cookie" storage="cookie" :expire="1">
        <ab-test name="A" chance="2">
          Test A
        </ab-test>
        <ab-test name="B" chance="1">
          Test B
        </ab-test>
      </ab-tests>
    `,
  }

  let wrapper = mount(Component, {
    global: {
      plugins: [ ABTestPlugin ]
    }
  })

  const first = wrapper.text();

  for (let i=0; i<repeat; i++) {
    wrapper = mount(Component, {
      global: {
        plugins: [ ABTestPlugin ]
      }
    })

    expect(wrapper.text()).toBe(first)
  }
})