import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    display: none;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-y: hidden;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Wanted Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #fff;
  }

  a {
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: 'Wanted Sans Variable', sans-serif;
  }

  p {
    margin: 0;
    font-family: 'Wanted Sans Variable', sans-serif;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  button, input, textarea {
    font-family: 'Wanted Sans Variable', sans-serif;
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
    background: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  @font-face {
    font-family: "Wanted Sans Variable";
    font-style: normal;
    font-display: swap;
    font-weight: 500 700;
    src: url("./fonts/WantedSansVariable.woff2") format("woff2-variations");
  }

  @font-face {
    font-family: "goorm Sans";
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: url("./fonts/goorm-sans-bold.woff") format("woff2");
  }

  @font-face {
    font-family: "goorm Sans";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: url("./fonts/goorm-sans-regular.woff") format("woff2");
  }
`;

export default GlobalStyles;
