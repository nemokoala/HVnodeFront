declare namespace JSX {
  interface IntrinsicElements {
    input: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >;
    img: React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >;
    // 필요한 다른 HTML 요소들도 추가 가능합니다
  }
}

import { DetailedHTMLProps, HtmlHTMLAttributes } from "react";

declare module "react" {
  interface StyleHTMLAttributes<T> extends HtmlHTMLAttributes<T> {
    jsx?: boolean;
  }
}
