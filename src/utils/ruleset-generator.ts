import { extractDependencies } from './index';

export interface RulesetConfig {
  projectName: string;
  framework: 'react' | 'vue' | 'angular' | 'next' | 'nuxt' | 'svelte' | 'solid' | 'astro' | 'remix' | 'custom';
  customFramework?: string;
  styling: 'tailwind' | 'css-modules' | 'styled-components' | 'scss' | 'emotion' | 'stitches' | 'vanilla-extract' | 'custom';
  customStyling?: string;
  componentStructure: 'atomic' | 'feature-based' | 'flat' | 'custom';
  customStructure?: string;
  conventions: {
    naming?: {
      components?: boolean;
      props?: boolean;
      styles?: boolean;
    };
    structure?: {
      imports?: boolean;
      exports?: boolean;
      types?: boolean;
    };
    documentation?: {
      jsdoc?: boolean;
      readme?: boolean;
      examples?: boolean;
    };
  };
}

export interface GeneratedRuleset {
  name: string;
  rules: Rule[];
  examples: { [key: string]: string };
}

interface Rule {
  name: string;
  description: string;
  pattern: string;
  severity: 'error' | 'warning' | 'info';
  category: 'naming' | 'structure' | 'documentation' | 'styling';
}

/**
 * Generates a project-specific ruleset based on configuration
 */
export async function generateRuleset(config: RulesetConfig): Promise<GeneratedRuleset> {
  const rules: Rule[] = [];
  const examples: { [key: string]: string } = {};

  // Add framework-specific rules
  if (config.framework === 'react') {
    rules.push({
      name: 'react-component-naming',
      description: 'React components must use PascalCase',
      pattern: '^[A-Z][a-zA-Z0-9]*$',
      severity: 'error',
      category: 'naming'
    });
  }

  // Add styling rules
  if (config.styling === 'tailwind') {
    rules.push({
      name: 'tailwind-class-order',
      description: 'Tailwind classes should follow recommended ordering',
      pattern: '^(layout|spacing|sizing|typography|colors|effects).*$',
      severity: 'warning',
      category: 'styling'
    });
  }

  // Add structure rules
  if (config.componentStructure === 'atomic') {
    rules.push({
      name: 'atomic-structure',
      description: 'Components should be organized by atomic design principles',
      pattern: '^(atoms|molecules|organisms|templates|pages)/.*$',
      severity: 'warning',
      category: 'structure'
    });
  }

  // Generate example component
  const exampleCode = generateExampleComponent(config);
  examples['ExampleComponent.tsx'] = exampleCode || '';

  return {
    name: `${config.projectName}-ruleset`,
    rules,
    examples
  };
}

function generateExampleComponent(config: RulesetConfig): string {
  // Handle custom framework by using React as default template
  if (config.framework === 'custom') {
    return generateReactExample();
  }

  switch (config.framework) {
    case 'react':
    case 'next':
      return generateReactExample();
    case 'vue':
    case 'nuxt':
      return generateVueExample();
    case 'svelte':
      return generateSvelteExample();
    case 'solid':
      return generateSolidExample();
    case 'astro':
      return generateAstroExample();
    case 'remix':
      return generateRemixExample();
    case 'angular':
      return generateAngularExample();
    default:
      return '';
  }
}

function generateReactExample(): string {
  return `
import React from 'react';
interface ExampleComponentProps {
  title: string;
  description?: string;
  onAction: () => void;
}

/**
 * Example component following project conventions
 */
export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
  onAction
}) => {
  return (
    <div className={"flex flex-col p-4 bg-white rounded-lg shadow-md"}>
      <h2 className={"text-xl font-bold mb-2"}>{title}</h2>
      {description && (
        <p className={"text-gray-600 mb-4"}>{description}</p>
      )}
      <button
        onClick={onAction}
        className={"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"}
      >
        Click me
      </button>
    </div>
  );
};`;
}

function generateVueExample(): string {
  return `
<template>
  <div class="example-component">
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <button @click="onAction">Click me</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExampleComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    description: String,
  },
  methods: {
    onAction() {
      this.$emit('action');
    }
  }
}
</script>`;
}

function generateSvelteExample(): string {
  return `
<script lang="ts">
  export let title: string;
  export let description: string | undefined = undefined;
  
  function handleClick() {
    dispatch('action');
  }
</script>

<div class="example-component">
  <h2>{title}</h2>
  {#if description}
    <p>{description}</p>
  {/if}
  <button on:click={handleClick}>
    Click me
  </button>
</div>

<style>
  .example-component {
    padding: 1rem;
  }
</style>`;
}

function generateSolidExample(): string {
  return `
import { Component } from 'solid-js';

interface ExampleComponentProps {
  title: string;
  description?: string;
  onAction: () => void;
}

export const ExampleComponent: Component<ExampleComponentProps> = (props) => {
  return (
    <div class="example-component">
      <h2>{props.title}</h2>
      {props.description && <p>{props.description}</p>}
      <button onClick={props.onAction}>
        Click me
      </button>
    </div>
  );
};`;
}

function generateAstroExample(): string {
  return `
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="example-component">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  <button id="action-button">Click me</button>
</div>

<script>
  document.getElementById('action-button')?.addEventListener('click', () => {
    console.log('Button clicked!');
  });
</script>

<style>
  .example-component {
    padding: 1rem;
  }
</style>`;
}

function generateRemixExample(): string {
  return `
import type { ActionFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';

interface ExampleComponentProps {
  title: string;
  description?: string;
}

export const action: ActionFunction = async ({ request }) => {
  // Handle form submission
  return null;
};

export default function ExampleComponent({ title, description }: ExampleComponentProps) {
  return (
    <div className="example-component">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <Form method="post">
        <button type="submit">Click me</button>
      </Form>
    </div>
  );
}`;
}

function generateAngularExample(): string {
  return `
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-example',
  template: \`
    <div class="example-component">
      <h2>{{ title }}</h2>
      <p *ngIf="description">{{ description }}</p>
      <button (click)="onAction.emit()">Click me</button>
    </div>
  \`
})
export class ExampleComponent {
  @Input() title!: string;
  @Input() description?: string;
  @Output() onAction = new EventEmitter<void>();
}`;
} 