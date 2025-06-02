# Dynamate Design-to-Code Generator

A powerful tool for converting Figma designs into high-quality, production-ready code with built-in best practices and customizable rulesets.

## Features

- 🎨 **Figma Integration**: Direct integration with Figma through the MCP plugin
- 🧩 **Smart Component Recognition**: Accurately identifies and maps Figma components to code
- 🎯 **Framework Agnostic**: Supports React, Vue, Svelte, Angular, and more
- 🎭 **Multiple Styling Options**: Works with Tailwind, CSS Modules, Styled Components, and others
- 📏 **Custom Rulesets**: Generate and apply project-specific coding standards
- ♿ **Accessibility First**: Generates ARIA-compliant, semantic HTML
- 🔄 **Real-time Preview**: See your components come to life as you export
- 📚 **Documentation**: Automatic generation of component documentation and examples

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Figma account
- OpenAI API key (for AI-powered features)

## Installation

```bash
# Install globally
npm install -g dynamate-design-to-code

# Or install in your project
npm install --save-dev dynamate-design-to-code
```

## Quick Start

1. Initialize the tool in your project:
```bash
ddtc start
```

2. Follow the interactive setup to configure:
   - Figma access token
   - OpenAI API key (optional)
   - Preferred framework
   - Styling solution

3. Generate code from a Figma section:
```bash
ddtc generate "https://www.figma.com/file/...?node-id=..."
```

## Configuration

Create a `.ddtcrc.json` file in your project root:

```json
{
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

## Ruleset Management

Create and manage coding standards for your project:

```bash
# Create a new ruleset
ddtc ruleset

# Apply an existing ruleset
ddtc ruleset apply <ruleset-name>

# Remove a ruleset
ddtc ruleset remove <ruleset-name>
```

## Component Generation

Generate components with various options:

```bash
# Basic component generation
ddtc generate --file <figma-file-id> --output ./components

# With specific framework
ddtc generate --file <figma-file-id> --framework react --output ./components

# With styling options
ddtc generate --file <figma-file-id> --styling tailwind --output ./components

# Generate a single component
ddtc generate --component <component-id> --output ./components
```

## Project Structure

The tool creates the following structure in your project:

```
your-project/
├── .ddtcrc.json
├── .cursor/
│   └── rules/
│       └── your-ruleset/
│           ├── ruleset.json
│           └── examples/
├── components/
│   └── generated/
└── styles/
    └── generated/
```

## Best Practices

1. **Component Organization**
   - Use atomic design principles
   - Keep components focused and reusable
   - Follow consistent naming conventions

2. **Styling**
   - Use CSS variables for theming
   - Implement responsive designs
   - Follow BEM methodology when applicable

3. **Documentation**
   - Add JSDoc comments
   - Include usage examples
   - Document props and types

## Common Issues

1. **Component Recognition**
   - Ensure Figma components are properly structured
   - Use consistent naming in Figma
   - Group related elements appropriately

2. **Style Mapping**
   - Use Figma styles for colors and typography
   - Maintain consistent spacing units
   - Define reusable styles at the root level

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Documentation: [https://docs.dynamate.com](https://docs.dynamate.com)
- Issues: [GitHub Issues](https://github.com/dynamate/design-to-code/issues)
- Discord: [Join our community](https://discord.gg/dynamate)

## Credits

Developed by Dynamate - Making design-to-code conversion seamless and efficient. 