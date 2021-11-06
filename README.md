# At-rule Packer

A tool to Merge duplicate CSS media query and other At-rule rules together. Supports any At-rule that [PostCSS](https://postcss.org/) can handle including: `@media`, `@supports`, and even `@container`! If PostCSS supports the At-rule, so should this tool.

```
npm install -D at-rule-packer
```

[![npm version](https://badge.fury.io/js/at-rule-packer.svg)](http://badge.fury.io/js/at-rule-packer)
[![Build Status](https://travis-ci.org/soluml/at-rule-packer.svg?branch=master)](https://travis-ci.org/soluml/at-rule-packer)

By default, this package exports the PostCSS plugin. The standalone tool can be found under `dist/tool`.

## SYNOPSIS

With CSS Preprocessors, it's very common to nest media queries. It keeps related styles contextual for future developers:

```scss
.hello {
  color: black;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
}

.world {
  color: #111;

  @media (prefers-color-scheme: dark) {
    color: #efefef;
  }
}
```

However, this can result in inefficient CSS for the browser:

```css
.hello {
  color: black;
}
@media (prefers-color-scheme: dark) {
  .hello {
    color: white;
  }
}

.world {
  color: #111;
}
@media (prefers-color-scheme: dark) {
  .world {
    color: #efefef;
  }
}
```

The goal of this tool is the help eliminate these efficiencies when possible by changing the cascade and merging all duplicate At-rule's into the last At-rule block.

```css
.hello {
  color: black;
}

.world {
  color: #111;
}

@media (prefers-color-scheme: dark) {
  .hello {
    color: white;
  }

  .world {
    color: #efefef;
  }
}
```

However, this is _NOT_ a safe optimization and can result in CSS that works differently than intended:

### source

```html
<div class="mydiv font-size--medium">Hello World</div>
```

```css
.mydiv {
  color: blue;
  font-size: 1em;
  font-weight: bold;
}

@media (min-width: 64em) {
  .mydiv {
    font-size: 1.25em;
  }
}

/* Utilities */
.font-size--medium {
  font-size: 1em;
}

.aspect-ratio--video {
  aspect-ratio: 16 / 9;
}

@media (min-width: 64em) {
  .aspect-ratio--video {
    aspect-ratio: 4 / 3;
  }
}
```

### result

```css
.mydiv {
  color: blue;
  font-size: 1em;
  font-weight: bold;
}

/* Utilities */
.font-size--medium {
  font-size: 1em;
}

.aspect-ratio--video {
  aspect-ratio: 16/9;
}

@media (min-width: 64em) {
  .mydiv {
    font-size: 1.25em;
  }
  .aspect-ratio--video {
    aspect-ratio: 4/3;
  }
}
```

Therefore, it's important to ensure that this tool is used in CSS architectures that manage the cascade in a way that it doesn't matter where the rules end up in the stylesheet. It's also recommended that if you're going to use this tool, you do so early in development so that you can catch errors such as the above during development.

## USAGE

### As a PostCSS Plugin

The default export for this package is the PostCSS plugin. There are no configuration options so it can be used simply like so:

```js
postcss([require('at-rule-packer')({})]);
```

### As standard Node.js package

This package is a Node.js module. It takes in a single string (that should be a valid CSS string) and returns a css process css string minified and with comments removed:

```javascript
const atp = require('at-rule-packer/dist/tool');

// @supports not (display:grid){main{float:right}.grid{display:flex}}
console.log(
  atp(`
    @supports not (display: grid) {
      main {
        float: right;
      }
    }

    @supports not (display: grid) {
      .grid {
        display: flex;
      }
    }
  `)
);
```

## NOTES

A few considerations when determining whether or not you want to use this tool:

### CSS Cascading Order

As noted above, this tool will change the CSS Cascade Order! Vulnerable CSS architectures should **NOT** use this tool.

### Source Maps

As nodes are moving and shuffling around, Source Maps may not always be 100% accurate.

## LICENSE

MIT
