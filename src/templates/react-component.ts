export interface ComponentTemplateProps {
  name: string;
  props?: string[];
  children?: boolean;
  styles?: string;
}

export function generateComponentTemplate({
  name,
  props = [],
  children = false,
  styles = ''
}: ComponentTemplateProps): string {
  const propsInterface = props.length > 0 ? `
interface ${name}Props {
  ${props.join('\n  ')}${children ? '\n  children?: React.ReactNode;' : ''}
}
` : '';

  const propsType = props.length > 0 || children ? `: React.FC<${name}Props>` : '';
  const propsDestructure = props.length > 0 || children
    ? `{ ${[...props.map(p => p.split(':')[0]), children ? 'children' : ''].filter(Boolean).join(', ')} }`
    : '';

  return `import React from 'react';
${styles ? "import styles from './" + name + ".module.css';" : ''}

${propsInterface}
export const ${name}${propsType} = (${propsDestructure}) => {
  return (
    <div${styles ? " className={styles.container}" : ''}>
      {/* Component content */}
      ${children ? '{children}' : ''}
    </div>
  );
};
`;
}

export function generateStylesTemplate(name: string): string {
  return `.container {
  /* Add your styles here */
}
`;
} 