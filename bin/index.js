'use strict';

(function () {

  /**
   * Recursively parses a string of text in a way that loosely mimicks a Jison parser.
   * It looks at the beginning of the string, and attempts to find a match. If there
   * is no match, it collects a raw character and recurses. If it finds a match, it
   * collects the match, wraps it in a span with a class name, and recurses. It
   * goes until the whole string has been collected.
   *
   * @param  {Object} patterns  The array of pattern objects to parse against
   * @param  {String} incoming  The original text, being shortened as we recurse.
   * @param  {String} output    The new text with spans.
   *
   * @return {String} The output.
   */
  function parse(patterns, incoming, output) {

    /*
     * These variables will be used to help us figure out how to
     * wrap text when we find a match.
     */
    var match = null;
    var matchType = null;
    var matchPrefix = null;
    var matchSuffix = null;
    output = output || '';

    /*
     * Return the output when the incoming string has nothing left in it.
     */
    if (!incoming.length) return output || '';

    /*
     * Check each pattern against the string. If we find a match, assign it to the
     * match variable.
     */
    patterns.some(function (pattern) {
      var name = pattern.name;
      var isRegex = pattern.match instanceof RegExp;
      var capture = isRegex ? pattern.match : pattern.match[0];
      var prefix = isRegex ? null : pattern.match[1] || null;
      var suffix = isRegex ? null : pattern.match[2] || null;

      match = incoming.match(capture);
      matchType = match ? pattern.name : null;
      matchPrefix = prefix;
      matchSuffix = suffix;
      return !!match;
    });

    /*
     * If there was no match, collect one character and recurse.
     */
    if (!match) {
      return parse(patterns, incoming.slice(1), output + incoming[0]);

      /*
       * If there was a match, wrap it in a span. If we have a prefix and/or
       * suffix, drop those in too.
       */
    } else {
      var replacement = '<span class="' + matchType + '">' + match[1] + '</span>';
      if (matchPrefix) replacement = matchPrefix + replacement;
      if (matchSuffix) replacement = replacement + matchSuffix;

      /*
       * Collect the match and recurse
       */
      return parse(patterns, incoming.slice(match[0].length), output + replacement);
    }
  }

  /**
   * Custom-syntax-highlighter is nice and knows that you like to indent code
   * when you're writing. It doesn't expect you to dedent your `pre` and `code`
   * tags all the way to the left just so it won't appear weirdly indented in the
   * output.
   *
   * This function does some convenient whitespace parsing to help with things like that.
   *
   * @param  {String} text  The original, unparsed text.
   *
   * @return {String} The cleaned up text.
   */
  function clean(text) {

    /*
     * Cut out useless new line lines at the front and back.
     * Check to see if there's some indentation and return if not.
     */
    var trimmed = text.replace(/^\n+|\n+\s+$/g, '');
    var spaceToCut = trimmed.match(/^\s+/);
    if (!spaceToCut) return trimmed;

    /*
     * Split the block into an array of lines. For each one, remove the
     * matched indentation from the front.
     */
    var textArray = trimmed.split('\n');
    var dedented = textArray.map(function (string, index) {
      return !string || /^\s+$/.test(string) ? string : string.replace(spaceToCut[0], '');
    }).join('\n');

    /*
     * Spit out the dedented text.
     */
    return '\n' + dedented;
  }

  /**
   * Highlights code blocks in a way you specify.
   *
   * @param  {Object} config    Allows the following keys:
   *                              patterns:    [...] (The regex patterns used to parse)
   *                              linenums:    true  (Turns on line numbers)
   *                              selector:    'pre' (Defaults to 'pre code')
   *                              preProcess:  fn    (Allows you to eff with the string after parsing)
   *                              postProcess: fn    (Allows you to eff with the string after parsing)
   *
   * @return {undefined}
   */
  function highlight(config) {
    var selector = config.selector || 'pre code';
    var postProcess = config.postProcess || function (str) {
      return str;
    };
    var preProcess = config.preProcess || function (str) {
      return str;
    };

    /*
     * Find all `pre code` blocks and loop over them. For each block...
     */
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (block) {
      var patterns = (typeof config.patterns === 'function' ? config.patterns(block) : config.patterns) || {};

      /*
       * Get the inner text, clean the text, then parse the text with the patterns.
       */
      var innerText = block.innerText;
      var cleanText = clean(innerText);
      var parsed = postProcess(parse(patterns, preProcess(cleanText)));

      /*
       * If the user wants line numbers, split the parsed text on new lines
       * and loop over each line.
       */
      if (config.linenums) {
        parsed = parsed.split('\n').map(function (string, index) {

          /*
           * Create a line number like 00, 01, 02, etc...
           */
          if (!index) return string;
          var ind = index - 1 + '';
          if (ind.length < 2) ind = '0' + ind;

          /*
           * Return a new span on the beginning og the line.
           */
          return '<span class="linenum">' + ind + '</span> ' + string;
        }).join('\n');
      }
      block.innerHTML = parsed;
    });
  }

  /*
   * Export the hightlight function
   */
  if (typeof module !== 'undefined') {
    module.exports = exports = highlight;
  } else if (typeof window !== 'undefined') {
    window.csHighlight = window.csHighlight || highlight;
  }
})();