declare module 'figma-api' {
  export interface FigmaConfig {
    personalAccessToken: string;
  }

  export interface FigmaResponse {
    document: any;
    components: { [key: string]: any };
    styles: { [key: string]: any };
    name: string;
  }

  export interface FigmaNodeResponse {
    nodes: {
      [key: string]: {
        document: any;
        components: { [key: string]: any };
        styles: { [key: string]: any };
      };
    };
  }

  export class Api {
    constructor(config: FigmaConfig);
    getFile(fileId: string): Promise<FigmaResponse>;
    getFileNodes(
      fileId: string,
      params?: {
        geometry?: 'paths';
        plugin_data?: 'shared';
        styles?: boolean;
      }
    ): Promise<FigmaNodeResponse>;
  }
} 