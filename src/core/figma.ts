import * as Figma from 'figma-js';
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
  private client: Figma.ClientInterface;

  constructor(config: FigmaConfig) {
    this.client = Figma.Client({
      accessToken: config.accessToken
    });
  }

  async getFileComponents(fileId: string): Promise<ComponentNode[]> {
    try {
      const file = await this.client.file(fileId);
      return this.extractComponents(file.data.document);
    } catch (error) {
      throw new Error(`Failed to fetch Figma components: ${error}`);
    }
  }

  private extractComponents(node: any): ComponentNode[] {
    const components: ComponentNode[] = [];

    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      components.push({
        id: node.id,
        name: node.name,
        type: node.type
      });
    }

    if (node.children) {
      node.children.forEach((child: any) => {
        components.push(...this.extractComponents(child));
      });
    }

    return components;
  }

  async getComponentStyles(componentId: string) {
    try {
      const styles = await this.client.fileStyles(componentId);
      return styles.data;
    } catch (error) {
      throw new Error(`Failed to fetch component styles: ${error}`);
    }
  }
} 