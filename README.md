# Dynamate Design-to-Code Generator

A powerful tool for converting Figma designs into high-quality, production-ready code with built-in best practices and customizable rulesets.

## Features

- 🎨 **Figma MCP Integration**: Seamless integration with Figma through the Model Context Protocol
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
- Figma account with access to the files you want to convert
- Figma API access token (for reading file data)

## Installation

```bash
# Install globally
npm install -g dynamate-design-to-code

# Or install in your project
npm install --save-dev dynamate-design-to-code
```

## Setting up Figma MCP

The tool uses the Model Context Protocol (MCP) server to access your Figma files. Here's how to set it up:

### Quick Setup with NPM

Run the MCP server using NPX:

```bash
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
```

The server will start in HTTP mode on port 3333 by default.

### Configuration Options

You can configure the server using either:

1. Environment variables (via `.env` file):
   - `FIGMA_API_KEY`: Your Figma API access token
   - `PORT`: Server port (default: 3333)

2. Command-line arguments:
   - `--figma-api-key`: Your Figma API access token
   - `--port`: Server port
   - `--stdio`: Run in command mode instead of HTTP/SSE

### Connecting to Cursor

1. Start the MCP server
2. Open Cursor's settings
3. Go to the Features tab
4. Connect Cursor to the MCP server (default: http://localhost:3333)
5. Verify the connection - you should see a green dot when connected

## Quick Start

1. Initialize the tool in your project:
```bash
ddtc start
```

2. Follow the interactive setup to configure:
   - Framework preference (React, Vue, etc.)
   - Styling solution (Tailwind, CSS Modules, etc.)
   - Component structure
   - Coding conventions

3. Generate code from a Figma design:
   - Open Cursor's composer in agent mode
   - Paste a Figma file/frame/component link
   - Ask Cursor to implement the design

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

1. **Figma Organization**
   - Use consistent naming conventions for components
   - Group related elements logically
   - Utilize Figma's auto-layout features
   - Set up proper constraints for responsive designs

2. **Component Structure**
   - Follow atomic design principles
   - Keep components focused and reusable
   - Implement proper prop typing
   - Use semantic HTML elements

3. **Styling**
   - Use CSS variables for theming
   - Implement responsive designs
   - Follow BEM methodology when applicable
   - Leverage framework-specific best practices

4. **Documentation**
   - Add JSDoc comments
   - Include usage examples
   - Document props and types
   - Provide responsive behavior notes

## Common Issues

1. **Component Recognition**
   - Ensure Figma components are properly structured
   - Use consistent naming in Figma
   - Group related elements appropriately
   - Utilize auto-layout when possible

2. **Style Mapping**
   - Use Figma styles for colors and typography
   - Maintain consistent spacing units
   - Define reusable styles at the root level
   - Keep color styles organized

3. **MCP Connection**
   - Verify the MCP server is running
   - Check Figma API token permissions
   - Ensure correct port configuration
   - Confirm Cursor settings are correct

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