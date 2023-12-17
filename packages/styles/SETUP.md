# Basic proyect setup

```
 npm i --ignore-scripts
 # or
 yarn --ignore-scripts
```

# Development

## SASS & CSS rules

Sass is an amazing preprocesor but some of their rules could become missused

#### No more than 3 leves of nesting

#### Dont use the ampersand to nest elements childs, avoid this:

```scss
.x {
	&-name {
		&-child {
		}
	}
}
```

#### Ampersand usage is allowed for modifiers & similar

-   This is because usually you would be only searching for the element or the modifier name
-   As you can see this doesn't break the first rule

```scss
.x-elementName {
	&.--modifierName {
		&--modifierValue {
		}
		&--otherModifierValue {
		}
	}
}
```

#### For conditional modifiers prepending is prefered

-   This limits the nesting and shows the required modifier

```scss
.x-elementName {
	&.--requiredModifier.conditionalModifier {
		&--modifierValue {
		}
		&--otherModifierValue {
		}
	}
}
```

#### Each property should follow the next order

-   Tag, element or layout (a, .x-elementname, etc...)
-   Pseudoselectors (:hover, :focus, etc...)
-   Statuses (.is--statusname, etc...)
-   Modifiers (.--modifiername-value, etc...)
-   Subelements or childs
-   Overwrites
-   Media queries

#### And for each grouped rules should go in the end

```scss
.x-element1 {
}
.x-element2 {
}

/** Rule group */
.x-element1,
.x-element2 {
}
```
