# Dynamate Design-to-Code

A tool for converting Figma designs to production-ready code with Cursor integration.

## Features

- Figma design import and component recognition
- Code generation with semantic HTML and modern best practices
- Cursor integration for AI-powered code generation
- Project-specific rulesets for consistent code style
- Support for React, Vue, and Angular
- Integration with popular styling solutions (Tailwind, CSS Modules, Styled Components)

## Installation

```bash
npm install -g dynamate-design-to-code
```

The tool can be invoked using either the full command `dynamate-design-to-code` or the shorter alias `ddtc`:

```bash
# Using the full command
dynamate-design-to-code init

# Using the shorter alias
ddtc init
```

## Usage

### Basic Usage

```bash
# Initialize a new project
ddtc init

# Generate code from a Figma file
ddtc generate --figma-file <file-id>
```

### Figma Design-to-Code Workflow

The tool provides a seamless workflow for converting Figma designs into production-ready code:

1. **Design Import**
   - Connect to your Figma files using an API key
   - Import component structures and styles
   - Maintain design hierarchy and relationships

2. **Component Recognition**
   - Automatic detection of reusable components
   - Extraction of styles, properties, and variants
   - Support for nested component structures

3. **Code Generation**
   - Generate semantic HTML structure
   - Create styled components with proper CSS/Tailwind classes
   - Implement responsive design patterns
   - Add TypeScript types and props interfaces
   - Include accessibility attributes

4. **Style Processing**
   - Extract design tokens (colors, typography, spacing)
   - Generate consistent styling code
   - Support for various styling solutions:
     - Tailwind CSS utility classes
     - CSS Modules with scoped styles
     - Styled Components with theme support

#### Example: Converting a Figma Component

Given a Figma component like a Button:

```typescript
// Input: Figma Button Component
{
  id: 'button-primary',
  name: 'Button/Primary',
  type: 'COMPONENT',
  styles: {
    fill: '#3B82F6',
    typography: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 500
    }
  }
}

// Output: React Component
import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      className={`button button--${variant}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
```

### Configuration

#### Figma API Setup

1. Get your Figma API key from your Figma account settings
2. Configure the tool with your API key:
   ```bash
   dynamate-design-to-code config set --figma-token <your-api-key>
   ```

#### Component Generation Settings

You can customize the code generation process through a configuration file:

```json
{
  "framework": "react",
  "styling": "tailwind",
  "typescript": true,
  "componentStructure": "atomic",
  "figma": {
    "componentPrefix": "Fig",
    "styleTokens": true,
    "responsiveBreakpoints": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px"
    }
  }
}
```

### Working with Rulesets

Rulesets help maintain consistency in your codebase by defining project-specific rules and conventions.

#### Creating a Ruleset

```bash
dynamate-design-to-code ruleset create
```

This will prompt you for:
- Project name
- Framework choice (React, Vue, Angular)
- Styling solution (Tailwind, CSS Modules, Styled Components)
- Component structure (Atomic, Feature-based, Flat)
- Conventions to enforce:
  - Naming conventions (components, props, styles)
  - Structure conventions (imports, exports, types)
  - Documentation requirements (JSDoc, README, examples)

#### Example Ruleset Configuration

```json
{
  "projectName": "my-app",
  "framework": "react",
  "styling": "tailwind",
  "componentStructure": "atomic",
  "conventions": {
    "naming": {
      "components": true,
      "props": true,
      "styles": true
    },
    "structure": {
      "imports": true,
      "exports": true,
      "types": true
    },
    "documentation": {
      "jsdoc": true,
      "readme": true,
      "examples": true
    }
  }
}
```

#### Applying a Ruleset

```bash
# Apply a ruleset to your project
dynamate-design-to-code ruleset apply <ruleset-name>

# Remove a ruleset
dynamate-design-to-code ruleset remove <ruleset-name>
```

#### Generated Files

The ruleset generator creates:
- `.cursor/rules/<ruleset-name>/config.json`: Ruleset configuration
- `.cursor/rules/<ruleset-name>/examples/`: Example components following the ruleset
- `.cursor/config.json`: Updated Cursor configuration with ruleset reference

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/dynamate-design-to-code.git
cd dynamate-design-to-code

# Install dependencies
npm install

# Build the project
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- ruleset.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cursor IDE team
- Figma MCP plugin developers
- OpenAI team
- Dynamate development team 