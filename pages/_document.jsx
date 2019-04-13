import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <link rel='stylesheet' href='/static/css/zeit/buttons.css' />
          <link rel='stylesheet' href='/static/css/inputs.css' />
          <link rel='stylesheet' href='/static/css/master.css' />
          <link rel='stylesheet' href='/static/themes/dracula.css' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
