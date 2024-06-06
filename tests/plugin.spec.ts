import { expect, test, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ABTestPlugin } from '../src';

const originalMathRandom = Math.random;

test('Test rendering', () => {
  Math.random = vi.fn(() => 0.7);

  const Component = {
    template: `
      <ab-tests>
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
      <ab-tests>
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
      <ab-tests>
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
      <ab-tests>
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
      <ab-tests @selected="selected">
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

  const Component = {
    template: `
      <ab-tests>
        <ab-test name="A" chance="2">
          Test A
        </ab-test>
        <ab-test name="B" chance="1">
          Test B
        </ab-test>
        <ab-test name="C" chance="3">
          Test C
        </ab-test>
      </ab-tests>
    `,
  }

  let wrapper: any = null;
  for (let i=0; i<repeat; i++) {
    wrapper = mount(Component, {
      global: {
        plugins: [ ABTestPlugin ]
      }
    });

    statistic[wrapper.html().trim()]++;
  }

  for (let key in statistic) {
    statistic[key] = Math.floor(statistic[key] / repeat * 100);
  }
  
  expect(statistic['Test A']).toBeLessThanOrEqual(34 + deviation);
  expect(statistic['Test B']).toBeLessThanOrEqual(17 + deviation);
  expect(statistic['Test C']).toBeLessThanOrEqual(49 + deviation);
})