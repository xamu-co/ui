export * from "./types/props";

// base
export { default as BaseBrowserOnly } from "./components/base/BrowserOnly.vue";
export { default as BaseImg } from "./components/base/Img.vue";
export { default as BaseAction } from "./components/base/Action.vue";
export { default as BaseInput } from "./components/base/Input.vue";
export { default as BaseSelect } from "./components/base/Select.vue";
export { default as BaseWrapper } from "./components/base/Wrapper.vue";
export { default as BaseBox } from "./components/base/Box.vue";
export { default as BaseErrorBoundary } from "./components/base/ErrorBoundary.vue";

// icon
export { default as Icon } from "./components/icon/Simple.vue";
export { default as IconFa } from "./components/icon/Fa.vue";

// action
export { default as ActionButton } from "./components/action/Button.vue";
export { default as ActionButtonLink } from "./components/action/ButtonLink.vue";
export { default as ActionButtonToggle } from "./components/action/ButtonToggle.vue";
export { default as ActionLink } from "./components/action/Link.vue";

// input
export { default as InputFile } from "./components/input/File.vue";
export { default as InputText } from "./components/input/Text.vue";
export { default as InputToggle } from "./components/input/Toggle.vue";
export { default as InputColor } from "./components/input/Color.vue";
export { default as InputCode } from "./components/input/Code.vue";

// select
export { default as Select } from "./components/select/Simple.vue";
export { default as SelectFilter } from "./components/select/Filter.vue";
export { default as SelectChoice } from "./components/select/Choice.vue";

// value
export { default as Value } from "./components/value/Simple.vue";
export { default as ValueList } from "./components/value/List.vue";
export { default as ValueComplex } from "./components/value/Complex.vue";

// box
export { default as BoxAction } from "./components/box/Action.vue";
export { default as BoxMessage } from "./components/box/Message.vue";
export { default as BoxEditor } from "./components/box/Editor.vue";

// loader
export { default as Loader } from "./components/loader/Simple.vue";
export { default as LoaderContent } from "./components/loader/Content.vue";
export { default as LoaderContentFetch } from "./components/loader/ContentFetch.vue";

// pagination
export { default as Pagination } from "./components/pagination/Simple.vue";
export { default as PaginationContent } from "./components/pagination/Content.vue";
export { default as PaginationContentTable } from "./components/pagination/ContentTable.vue";

// form
export { default as FormInput } from "./components/form/Input.vue";
export { default as Form } from "./components/form/Simple.vue";
export { default as FormStages } from "./components/form/Stages.vue";

// singletons
export { default as Modal } from "./components/modal/Simple.vue";
export { default as Dropdown } from "./components/dropdown/Simple.vue";
export { default as Table } from "./components/table/Simple.vue";
export { default as Slider } from "./components/slider/Simple.vue";
export { default as Collapse } from "./components/collapse/Simple.vue";

// composables
export { default as useTheme } from "./composables/theme";
export { default as useMarkdown } from "./composables/markdown";
