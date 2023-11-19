# Xamu UI, style system

[![npm (scoped)](https://img.shields.io/npm/v/%40open-xamu-co/ui-styles)](https://github.com/xamu-co/ui/tree/dev/packages/styles) [![CircleCI](https://dl.circleci.com/status-badge/img/gh/xamu-co/ui/tree/dev.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/xamu-co/ui/tree/dev)

These are the basic guidelines behind this project.

-   based in BEM but reinterpreted for sass and vue
-   prefixes prevent the collision with vendor styling
-   the "x" stands for xamu

Explore the [docs](https://styles.xamu.com.co/) or learn how to setup the project for development at: [Setup](SETUP.md)

Older package names

-   @xamu-co/style-system
-   @xamu-co/styles

#Xamu UI, style systemElements & layouts:

They are the main building blocks of any design.

### Root components

Elements & layouts all share a root component

**.componentName{}**

```css
.view {
}
```

Some of them will expect certain tag

```css
a.link {
}
```

Whenever possible avoid using long names. **flx** will always be better than **flexbox** while mantaining legibility

### Nested components

Elements & layouts could have nested components, to differentiate them from their parent a **"-"** will be used

**.parentComponentName-childComponentName{}**

```css
.view-item {
}
```

## Utility classes:

Each element comes tied with a set classes to alter it

```scss
.componentName.optionalUtilityType--utilityName-utilityfirstOptionalParam-utilitysecondOptionalParam {
}
.componentName {
	&.optionalUtilityType--utilityName {
		&-utilityfirstOptionalParam {
			&-utilitysecondOptionalParam {
			}
		}
	}
}
```

This allows the duplication without collision

### Status

As the name implies these are for management of the design state and are usually called upon in a dinamyc way using js or related languages
It can be **"has"** but we recommend using **"is"**, These usually don't have need params

**.elementName.is--statusName{}**

```css
.view.is--active {
}
```

### Modifiers

These could modify the behavior of the component they are applied on

**.elementName.--modifierName-optionaParam{}**

```css
.view.--maxWidth-none {
}
```

Some modifier could be conditionated to the presence of another one

```css
.view.--tm-light.--shadow {
}
```

### Unions

While modifiers are useful they can also get to verbose. That is whe unions come handy.
Combination of modifiers, shortcuts for common modifier combinations

**.elementName.--unionName-firstModifier-secondModifier{}**

```css
.view.--flxAlign-center-stretch {
}
```

If both values are equal the could be merged

```css
/** Long version */
.view.--flxAlign-center-center {
}

/** Short version */
.view.--flxAlign-center {
}
```

## Pseudos

Components, but this time making use of pseudo elements (:before, :after)
For the pseudos we will be using data atributes.

**[data-pseudoName]{}**

```css
[data-tip] {
}
```

### Modifiers & Unions:

Slightly different syntax, but don't worry the concept is mantained.
Some of them are expecting an argument

**[data-pseudoName-modifierNameOrParam-optionalParam="optionalArgument"]{}**

```css
[data-tip-position="top"] {
}
```

## Globals

Some properties can be used across the design.
Global classes are prepended with **"x"**
They also tend to override component modifiers and unions

### Modifiers

These modify the behavior of any element

**.--globalModifierName-value{}**

```css
.--maxWidth-none {
}
```

Just like the component modifiers but these work in any element
Some modifier could be conditionated to the presence of another one

```css
.--tm-light.--shadow {
}
```

### Unions:

Condense most common modifiers of rules that require multiple parameters

**.--globalUnionName-firstValue-SecondValue{}**

```css
.--flxAlign-center-stretch {
}
```

As any other union but work in any element
If both values are equal the could be merged

```css
/** Long version */
.--flxAlign-center-center {
}

/** Short version */
.--flxAlign-center {
}
```

## Responsive styles

We are following a similar approach to the tailwind framework (only for global modifiers & unions)

```css
/** Hide if element has less than 640px of width */
.--hidden:sm {
}

/** Hide if element has more than 640px of width */
.--hidden:sm-inv {
}
```

-   **xs**: 358px, extra small, enabled in specific cases
-   **sm**: 576px, small, enabled in specific cases
-   **md**: 768px, medium
-   **lg**: 1080px, large, enabled in specific cases
-   **xl**: 1280px, extralarge
