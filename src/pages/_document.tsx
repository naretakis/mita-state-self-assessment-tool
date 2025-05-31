import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add base tag to help with relative paths */}
        <base href="/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}