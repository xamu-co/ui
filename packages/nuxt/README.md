# Xamu UI, Nuxt Module

[![npm (scoped)](https://img.shields.io/npm/v/%40open-xamu-co/ui-nuxt)](https://github.com/xamu-co/ui/tree/dev/packages/nuxt) [![CircleCI](https://dl.circleci.com/status-badge/img/gh/xamu-co/ui/tree/dev.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/xamu-co/ui/tree/dev)

```shell
npm i @open-xamu-co/ui-nuxt
# or with yarn
yarn add @open-xamu-co/ui-nuxt
```

## Features

-   I18n support
-   Image optimization with nuxt/image

## Usage

Add to `modules` in `nuxt.config.ts`:

```js
// nuxt.config.ts, basic setup

export default defineNuxtConfig({
	modules: ["@open-xamu-co/ui-nuxt"],
});
```

## Settings

```js
// nuxt.config.ts, example configuration

export default defineNuxtConfig({
	modules: ["@open-xamu-co/ui-nuxt"],
	xamu: {
		lang: "es",
		country: "co",
	},
});
```

| Name               | Type                                                                                                          | Type                                                           | Description                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webComponents      | boolean                                                                                                       | false                                                          | Use web components                                                                                                                                                                                    |
| globalComponents   | boolean \| tComponent[]                                                                                       | true                                                           | Register all or specific components globally. If `true`, all components will be registered globally. If an array is provided, only the components specified in the array will be registered globally. |
| componentPrefix    | string                                                                                                        | "xamu"                                                         | Components prefix. The default value is `"xamu"`.                                                                                                                                                     |
| routerComponent    | ComponentType \| string                                                                                       | `NuxtLink` component from `"nuxt"`                             | Router component. If a router is used, this component is required for buttons to work.                                                                                                                |
| imageComponent     | ComponentType \| string                                                                                       | `NuxtImg` component from `"nuxt/image"`                        | Image component. This is an optional image optimization component.                                                                                                                                    |
| imageHosts         | string[]                                                                                                      | []                                                             | Hosts that contain images. Any URLs within these hosts will be treated as images.                                                                                                                     |
| lang               | "kr" \| "pt" \| "nl" \| "hr" \| "fa" \| "de" \| "es" \| "en" \| "fr" \| "ja" \| "it" \| "cn" \| "tr"          | "en"                                                           | The locale language code. The default value is `en` (English).                                                                                                                                        |
| locale             | tPluginLocale                                                                                                 | {} `en` locale from `"@open-xamu-co/ui-common-helpers/en"`     | Global locale values. You can implement your own or use the ones provided by `@open-xamu-co/ui-common-helpers/locale`. The default value is `en` (English).                                           |
| mediaQueryPixels   | { laptop?: number; tablet?: number; mobile?: number; }                                                        | { laptop: 1080; tablet: 768; mobile: 576; }                    | Object containing the media query limits (in pixels) for laptop, tablet, and mobile devices.                                                                                                          |
| swal               | { overrides?: SweetAlertOptions; preventOverrides?: SweetAlertOptions; loaderOverrides?: SweetAlertOptions; } | {} Swal defaults from `"@open-xamu-co/ui-common-helpers/swal"` | Object containing the overrides for the `swal` library.                                                                                                                                               |
| country            | string                                                                                                        | undefined                                                      | ISO 2 code for the default country. When a country is provided, forms will omit the country field.                                                                                                    |
| disableAutoAnimate | boolean                                                                                                       | false                                                          | A boolean value indicating whether to disable automatic animations.                                                                                                                                   |
| fontAwesomePro     | boolean                                                                                                       | false                                                          | A boolean value indicating whether to use the Pro version of Font Awesome (regular and light styles).                                                                                                 |
| first              | number                                                                                                        | 10                                                             | The default pagination limit.                                                                                                                                                                         |

Used types can be imported from `@open-xamu-co/ui-common-types` or `@open-xamu-co/ui-common-enums`

## Development

```bash
# run before development
$ yarn build
# or from the root
$ yarn p:nuxt build
```

preserveSymlinks could break the module

## License

[MIT](http://opensource.org/licenses/MIT)
