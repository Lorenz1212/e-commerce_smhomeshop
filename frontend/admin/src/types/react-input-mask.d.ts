declare module 'react-input-mask' {
  import * as React from 'react';

  interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string;
    alwaysShowMask?: boolean;
    beforeMaskedValueChange?: (
      newState: { value: string; selection: { start: number; end: number } },
      oldState: { value: string; selection: { start: number; end: number } },
      userInput: string,
      maskOptions: any
    ) => { value: string; selection: { start: number; end: number } };
  }

  const InputMask: React.FC<InputMaskProps>;

  export default InputMask;
}
