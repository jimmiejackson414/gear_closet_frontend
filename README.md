# Gear Closet Frontend

## Included
* [Vue 3](https://v3.vuejs.org)
* [Vite](https://vitejs.dev)
* [Typescript](https://v3.vuejs.org/guide/typescript-support.html)
* [Vue Router](https://next.router.vuejs.org/guide/)
* [Quasar](https://quasar.dev)
* [Pinia](https://pinia.vuejs.org)
* [Eslint](https://eslint.vuejs.org) / [Stylelint](https://stylelint.io)


## Getting Started
1. Clone the repository
2. `cd` into the repository and run `yarn install`.
3. Run `yarn cert` to generate a `localhost-key.pem` and `localhost.pem` file, which allows for the local server to be run on https.
4. Run `yarn dev` to run the development server.
5. Party.

## VSCode

It is suggested that you install the [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) extension (instead of Vetur). Volar is now the officially recommended extension and comes with much better Typescript support out of the box.

In addition, you can add the following settings to either your User or Workspace settings:
```javascript
{
  "css.validate": false,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "less.validate": false,
  "scss.validate": false,
  "stylelint.validate": [
    "vue",
    "css",
    "scss"
  ]
}
```

## Other
* A path alias has been set up to work with Typescript and Eslint. For example, rather than importing a component from `../../../src/components/Foo.vue`, you can simply use `@/components/Test.vue`. To modify or add path aliases, check out the `vite.config.ts` and `tsconfig.json` files.

* To get Pinia to show up in your VueJS Devtools, be sure to install the VueJS [**Beta** Chrome extension](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg?hl=en) or [Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search).

* With any changes to the typeDefs on the backend, or changes to the .gql queries/mutations, you must run the GraphQL Code Generator. To do this, make sure the backend is running in a separate terminal tab or window run `yarn codegen` so that server introspection may occur. Optionally append `-w` to the yarn command to watch for changes.

## Other Resources
* [Bootstrap Icons](https://icons.getbootstrap.com)
* [Google Material Icons](https://fonts.google.com/icons?selected=Material+Icons)
* [Hero Patterns](https://heropatterns.com/)
