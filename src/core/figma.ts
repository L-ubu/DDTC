import { Api as Figma } from 'figma-api';
import dotenv from 'dotenv';

dotenv.config();

export interface FigmaConfig {
  accessToken: string;
  fileId: string;
}

export interface ComponentNode {
  id: string;
  name: string;
  type: string;
  children?: ComponentNode[];
}

export class FigmaService {
  private client: Figma;

  constructor(config: FigmaConfig) {
    this.client = new Figma({
      personalAccessToken: config.accessToken
    });
  }

  async getFileComponents(fileId: string): Promise<ComponentNode[]> {
    try {
      const response = await this.client.getFile(fileId);
      return this.extractComponents(response.document);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch Figma components: ${errorMessage}`);
    }
  }

  private extractComponents(node: any): ComponentNode[] {
    const components: ComponentNode[] = [];

    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      components.push({
        id: node.id,
        name: node.name,
        type: node.type,
      });
    }

    if (node.children) {
      for (const child of node.children) {
        components.push(...this.extractComponents(child));
      }
    }

    return components;
  }

  async getComponentStyles(componentId: string) {
    try {
      const response = await this.client.getFileNodes(componentId, {
        geometry: 'paths',
        plugin_data: 'shared',
        styles: true
      });
      return response.nodes[componentId];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch component styles: ${errorMessage}`);
    }
  }
} 