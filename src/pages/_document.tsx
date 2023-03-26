import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div id="image-popup"></div>
        <div id="burger"></div>
        <div id="submit-popup"></div>
        <div id="login-popup"></div>
        <div id="widjet-popup"></div>
        <script
          id="ISDEKscript"
          src="https://widget.poizonqq.ru/widget/widjet.js"
        ></script>
      </body>
    </Html>
  );
}
