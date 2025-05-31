declare module 'figma-js' {
  export interface ClientInterface {
    file(fileId: string): Promise<any>;
    fileStyles(fileId: string): Promise<any>;
  }

  export class Client implements ClientInterface {
    constructor(options: { accessToken: string });
    file(fileId: string): Promise<any>;
    fileStyles(fileId: string): Promise<any>;
  }
} 