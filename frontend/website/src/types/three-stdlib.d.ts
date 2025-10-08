declare module 'three/examples/jsm/loaders/OBJLoader.js' {
  import { Loader } from 'three';
  export class OBJLoader extends Loader {
    load(
      url: string,
      onLoad?: (object: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: string): any;
  }
}

declare module 'three/examples/jsm/loaders/MTLLoader.js' {
  import { Loader } from 'three';
  export class MTLLoader extends Loader {
    load(
      url: string,
      onLoad?: (materialCreator: any) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    setMaterialOptions(options: any): void;
    parse(text: string, path: string): any;
  }
}