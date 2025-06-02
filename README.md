# Dynamate Design-to-Code Generator

A powerful tool for converting Figma designs into high-quality, production-ready code using Cursor and the Figma Model Context Protocol (MCP).

## Features

- 🎨 **Figma MCP Integration**: Direct access to Figma designs through Cursor's composer
-   **AI-Powered Generation**: Smart code generation using Cursor's AI capabilities
- 🧩 **Smart Component Recognition**: Accurate identification and mapping of Figma components
- 🎯 **Framework Agnostic**: Support for React, Vue, Svelte, Angular, and more
- 🎭 **Multiple Styling Options**: Works with Tailwind, CSS Modules, Styled Components, and others
- 📏 **Custom Rulesets**: Define and apply project-specific coding standards
-   **Accessibility First**: Generates ARIA-compliant, semantic HTML
- 📚 **Documentation**: Automatic component documentation and examples

## Prerequisites

- [Cursor](https://cursor.sh) installed
- Node.js (v16 or higher)
- npm or yarn
- Figma account with API access token ([Get token here](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens))

## Installation

```bash
# Install globally
npm install -g dynamate-design-to-code

# Or install in your project
npm install --save-dev dynamate-design-to-code
```

## Quick Start

1. Initialize the tool and set up MCP:
```bash
ddtc start
```

This will guide you through:
- Setting up your Figma API token
- Connecting Cursor to the MCP server
- Starting the MCP server
- Configuring your development preferences

2. Using with Cursor:
   - Open Cursor's composer in agent mode (⌘/Ctrl + Shift + L)
   - Copy a Figma link (select element in Figma → ⌘/Ctrl + L)
   - Paste the link in composer
   - Ask Cursor to implement the design

3. Using Command Line:
```bash
# Generate code from a Figma link
ddtc generate [figma-link]

# Create a new ruleset
ddtc ruleset create

# Apply an existing ruleset
ddtc ruleset apply
```

## Figma MCP Setup

The tool uses Cursor's Model Context Protocol (MCP) integration to access your Figma files. Here's how it works:

### 1. Configure MCP in Cursor

1. Open Cursor Settings (⌘/Ctrl + ,)
2. Go to the Features tab
3. Find "Model Context Protocol (MCP)"
4. Add `http://localhost:3333` as an MCP server
5. Click Save

### 2. Start the MCP Server

Run the server using one of these methods:

```bash
# Using ddtc (recommended)
ddtc start

# Or directly with npx
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
```

### 3. Verify Connection

- Look for the green dot in Cursor's MCP settings
- Try pasting a Figma link in the composer
- The MCP server should log the request

## Configuration

The tool creates two configuration files:

1. `.env` - Stores your Figma access token:
```env
FIGMA_ACCESS_TOKEN=your_token_here
```

2. `.dynamaterc.json` - Defines your development preferences:
```json
{
  "generator": {
    "framework": "react",
    "styling": "tailwind",
    "features": {
      "typescript": true,
      "storybook": true,
      "tests": true,
      "accessibility": true
    }
  }
}
```

## Ruleset Management

Rulesets help maintain consistent coding standards. You can manage them in two ways:

### Via Cursor Settings

1. Open Settings (⌘/Ctrl + ,)
2. Go to Features tab
3. Scroll to Rulesets
4. Add your ruleset file

### Via Command Line

```bash
# Create new ruleset
ddtc ruleset create

# List available rulesets
ddtc ruleset list

# Apply a ruleset
ddtc ruleset apply

# Remove a ruleset
ddtc ruleset remove
```

## Best Practices

1. **Figma Organization**
   - Use consistent component naming
   - Utilize auto-layout for better code generation
   - Group related elements logically
   - Set proper constraints for responsive designs

2. **Using the Composer**
   - Always use agent mode for design tasks
   - Be specific in your design implementation requests
   - Reference specific components or sections
   - Review and refine the generated code

3. **Ruleset Usage**
   - Create project-specific rulesets
   - Share rulesets across team projects
   - Keep rules focused and maintainable
   - Document rule purposes and examples

## Troubleshooting

### MCP Connection Issues

1. Check if the MCP server is running:
```bash
ddtc start
```

2. Verify Cursor settings:
   - Correct MCP server URL (http://localhost:3333)
   - Green connection indicator
   - Valid Figma API token

3. Common solutions:
   - Restart the MCP server
   - Check Figma token permissions
   - Clear Cursor's MCP cache
   - Verify port availability

## Support

- Documentation: [https://docs.dynamate.com](https://docs.dynamate.com)
- Issues: [GitHub Issues](https://github.com/dynamate/design-to-code/issues)
- Discord: [Join our community](https://discord.gg/dynamate)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Developed by Dynamate - Making design-to-code conversion seamless and efficient. 