# custom-syntax-highlighter

> Warning! Version 1.0.0+ is **not** backward compatible with versions 0.0.*

### Define your own syntax for highlighting code blocks!

So you don't like other syntax highlighters on the market, eh?

Too bloated?

Too complicated?

Buggy?

Doesn't support your language?

Meet **custom-syntax-highlighter** – the tiny, unassuming library that will finally give you exactly what you need: control.

## How it works:

Prepare yourself – you're going to need a basic understanding of regular expressions in order to parse a syntax. If you don't have that, you're gonna hate this. If you do, it'll be cake.

So the first thing you do is install it:

```bash
$ yarn add custom-syntax-highlighter

# or...

$ npm install custom-syntax-highlighter
```

Then you need to import it:

```javascript
import highlight from 'custom-syntax-highlighter';
```

Or you can also do it the old fashioned way:

```html
<script src="https://unpkg.com/custom-syntax-highlighter@latest/bin/index.js"></script>
<script>
var highlight = window.csHighlight;
</script>
```

Then you can go to town.

The idea is that you will define a collection of patterns to match against. Each one is associated with a class name. Custom-syntax-highlighter will loop over your code blocks and wrap the matches it finds with spans that have the class name. This way, you are free to control what gets wrapped and how it gets styled.

So let's say you had the following code:

```html
<pre>
  <code>
    callFunction('with string')
  </code>
</pre>
```

You might attack it with something like this:

```javascript
highlight({
  patterns: [
    {
      name: 'string',
      match: /^(\'[^\'\n]*\')/
    },
    {
      name: 'fn-call',
      match: [/^([A-z_]+)\(/, '', '(']
    }
  ]
})
```

Which would create this:

```html
<pre>
  <code>
    <span class="fn-call">callFunction</span>(<span class="string">'with string'</span>)
  </code>
</pre>
```

Allowing you to then style it as you like:

```css
.fn-call { color: blue }
.string  { color: green }
```

### Why did that work?

The `highlight` function takes a configuration object with many options, the most important of which is the "patterns" option. This should take the form of an array of objects (or function, but we'll get to that). Each object contains a `name` property that will ultimately translate to the classes given to the matched text, and a `match` property which is, in its most basic form, a regular expression associated with those classes.

Custom-syntax-highlighter works by testing each pattern object _in order_ against a string. If it doesn't find a match, it cuts the first character off the string and tries again. When it finds a match, it cuts off the whole match, wraps it in a span, and then continues until the string is completely used up. As such, **ALL OF YOUR PATTERNS SHOULD BEGIN WITH THE "^" CHARACTER TO INDICATE THAT ONLY THE BEGINNING OF THE STRING SHOULD BE TESTED**.

If you don't follow this rule, the processing will be far less efficient and you will get unexpected results.

You'll notice that each pattern in our example contains a capture group. This is how the system knows which piece of the matched pattern to actually wrap. Because sometimes you need to detect other characters that aren't part of the captured match, you can provide a 3-item array instead of a plain regular expression (as we did in the "fn-call" example). Item 0 is the regular expression, item 1 is a prefix to place before the wrapped match, and item 2 is a suffix to place after it, as needed.

And that's how you do it.

## More Options

#### `linenums: Boolean`

Defaults to false. If true, you'll get nice line numbers prefixed to each line.

#### `selector: String`

Defaults to `"pre code"`. It determines how the code blocks that should be processed can be identified.

#### `preProcess: Function`

Takes the incoming string of code after some whitespace cleaning has been done to it. It allows you to mess with the string a little bit if you need to before the system processes it. You should return a string of code for the system to process.

#### `postProcess: Function`

Takes the string of code after it has been processed and had spans inserted. This allows you to do any last minute tweaks before it gets rendered back into the DOM. For example, you could do something like...

```javascript
highlight({

  patterns: myPatterns,

  postProcess: string => {
    return string.replace(/,/g, '<span class="comma">,</span>')
  }

})
```

#### Using a function for the `patterns` options

If you use a function for the "patterns" option, that function will be called once for each identified block and should return either nothing if you don't want to process it, or an array of pattern objects with which to do the processing. For example:

```javascript
highlight({

  patterns: block => {

    if (/javascript/.test(block.className)) {
      return javaScriptPatterns;

    } else if (/html/.test(block.className)) {
      return htmlPatterns;

    }
    // Otherwise, return nothing.
  }

})
```

---

And now you're ready to build your own highlighter! Remember, if it doesn't work, it's probably your own fault.

Just kidding.

But seriously though... regex.
