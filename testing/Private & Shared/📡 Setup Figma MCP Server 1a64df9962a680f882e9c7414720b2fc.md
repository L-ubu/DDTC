# 📡 Setup Figma MCP Server

# What and How?

Give [Cursor](https://cursor.sh/) access to your Figma files with this [Model Context Protocol](https://modelcontextprotocol.io/introduction) server.

When Cursor has access to Figma design data, it's **way** better at one-shotting designs accurately than alternative approaches like pasting screenshots.

Get started quickly, see [Configuration](https://github.com/GLips/Figma-Context-MCP/blob/main/README.md#configuration) for more details:

```
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
```

**How it works**

1. Open Cursor's composer in agent mode.
2. Paste a link to a Figma file, frame, or group.
3. Ask Cursor to do something with the Figma file—e.g. implement a design.
4. Cursor will fetch the relevant metadata from Figma and use it to write your code.

This MCP server is specifically designed for use with Cursor. Before responding with context from the [Figma API](https://www.figma.com/developers/api), it simplifies and translates the response so only the most relevant layout and styling information is provided to the model.

Reducing the amount of context provided to the model helps make the AI more accurate and the responses more relevant.

**Demo Video**

[Watch a demo of building a UI in Cursor with Figma design data](https://youtu.be/6G9yb-LrEqg)

[](https://camo.githubusercontent.com/ac2f81a6eae330f0db71d9ed3748d332db97ad2e47c1c31520be36d75c7dfac0/68747470733a2f2f676c616d612e61692f6d63702f736572766572732f6b6366746f74723532352f6261646765)

# **1. Installation**

### **OPTION 1: Running the server quickly with NPM**

You can run the server quickly without installing or building the repo using NPM:

```
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>

# or
pnpx figma-developer-mcp --figma-api-key=<your-figma-api-key>

# or
yarn dlx figma-developer-mcp --figma-api-key=<your-figma-api-key>

# or
bunx figma-developer-mcp --figma-api-key=<your-figma-api-key>
```

Instructions on how to create a Figma API access token can be found [here](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens).

### **OPTION 2: Running the server from local source**

1. Clone the [repository](https://github.com/GLips/Figma-Context-MCP)
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env` and fill in your [Figma API access token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens). Only read access is required.
4. Run the server with `pnpm run dev`, along with any of the flags from the [Command-line Arguments](https://github.com/GLips/Figma-Context-MCP/blob/main/README.md#command-line-arguments) section.

**Configuration**

The server can be configured using either environment variables (via `.env` file) or command-line arguments. Command-line arguments take precedence over environment variables.

**Environment Variables**

- `FIGMA_API_KEY`: Your [Figma API access token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens) (required)
- `PORT`: The port to run the server on (default: 3333)

**Command-line Arguments**

- `-version`: Show version number
- `-figma-api-key`: Your Figma API access token
- `-port`: The port to run the server on
- `-stdio`: Run the server in command mode, instead of default HTTP/SSE
- `-help`: Show help menu

**Start the server**

```
> npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
# Initializing Figma MCP Server in HTTP mode on port 3333...
# HTTP server listening on port 3333
# SSE endpoint available at http://localhost:3333/sse
# Message endpoint available at http://localhost:3333/messages
```

# **2. Connect Cursor to the MCP server**

Once the server is running, [connect Cursor to the MCP server](https://docs.cursor.com/context/model-context-protocol) in Cursor's settings, under the features tab.

![](https://github.com/GLips/Figma-Context-MCP/raw/main/docs/cursor-MCP-settings.png)

After the server has been connected, you can confirm 
Cursor's has a valid connection before getting started. If you get a 
green dot and the tools show up, you're good to go!

![](https://github.com/GLips/Figma-Context-MCP/raw/main/docs/verify-connection.png)

# **3. Start using Composer with your Figma designs**

Once the MCP server is connected, **you can start using the tools in Cursor's composer, as long as the composer is in agent mode.**

Dropping a link to a Figma file in the composer and asking Cursor to do something with it should automatically trigger the `get_file` tool.

Most Figma files end up being huge, so you'll probably 
want to link to a specific frame or group within the file. With a single
 element selected, you can hit `CMD + L` to copy the link to the element. You can also find it in the context menu:

![](https://github.com/GLips/Figma-Context-MCP/raw/main/docs/figma-copy-link.png)

Once you have a link to a specific element, you can drop it in the composer and ask Cursor to do something with it.

**Inspect Responses**

To inspect responses from the MCP server more easily, you can run the `inspect` command, which launches the `@modelcontextprotocol/inspector` web UI for triggering tool calls and reviewing responses:

```
pnpm inspect
# > figma-mcp@0.1.0 inspect
# > pnpx @modelcontextprotocol/inspector
## Starting MCP inspector...
# Proxy server listening on port 3333
## 🔍 MCP Inspector is up and running at http://localhost:5173 🚀
```

**Available Tools**

The server provides the following MCP tools:

**get_file**

Fetches information about a Figma file.

Parameters:

- `fileKey` (string): The key of the Figma file to fetch
- `depth` (number, optional): How many levels deep to traverse the node tree

**get_node**

Fetches information about a specific node within a Figma file.

Parameters:

- `fileKey` (string): The key of the Figma file containing the node
- `nodeId` (string): The ID of the node to fetch