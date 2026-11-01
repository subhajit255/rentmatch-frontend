declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export { ReactComponent };
  const src: string;
  export default src;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '@hookform/resolvers/zod' {
  import { Resolver } from 'react-hook-form';
  import { ZodSchema } from 'zod';

  export const zodResolver: <T extends ZodSchema<any, any, any>>(
    schema: T,
    schemaOptions?: any,
    factoryOptions?: {
      mode?: 'async' | 'sync';
      raw?: boolean;
    }
  ) => Resolver<import('zod').TypeOf<T>>;
}

