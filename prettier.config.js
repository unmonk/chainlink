module.exports = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
    "@aacn.eu/tailwind-classname-order",
  ],
  tailwindFunctions: ["cva", "cn"],
};
