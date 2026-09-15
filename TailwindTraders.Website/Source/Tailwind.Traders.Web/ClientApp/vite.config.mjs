import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react({ include: /\.[jt]sx?$/ }),
      svgr(),
    ],
    define: {
      "import.meta.env.REACT_APP_DEV_API_URL": JSON.stringify(env.REACT_APP_DEV_API_URL),
      "import.meta.env.REACT_APP_API_URL_SHOPPINGCART": JSON.stringify(env.REACT_APP_API_URL_SHOPPINGCART),
      "import.meta.env.REACT_APP_USEB2C": JSON.stringify(env.REACT_APP_USEB2C),
      "import.meta.env.REACT_APP_USE_B2C": JSON.stringify(env.REACT_APP_USE_B2C),
      "import.meta.env.REACT_APP_B2CAUTHORITY": JSON.stringify(env.REACT_APP_B2CAUTHORITY),
      "import.meta.env.REACT_APP_B2CCLIENTID": JSON.stringify(env.REACT_APP_B2CCLIENTID),
      "import.meta.env.REACT_APP_B2CSCOPES": JSON.stringify(env.REACT_APP_B2CSCOPES),
    },
    server: {
      port: 3000,
    },
    test: {
      environment: "jsdom",
      globals: true,
      include: ["src/**/*.test.{js,jsx}"],
      css: true,
      server: {
        deps: {
          inline: ["izitoast"],
        },
      },
    },
  };
});
