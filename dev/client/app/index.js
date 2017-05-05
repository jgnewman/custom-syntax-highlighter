import highlight from '../../../bin/index';

const patterns = {
  "comment linecomment"  : /^(\/\/[^\/\n]*)/,
  "comment blockcomment" : /^(\/\*.*\*\/)/,
  singlequote            : /^(\'[^\'\n]*\')/,
  doublequote            : /^(\"[^\"\n]*\")/,
  backquote              : /^(\`[^\`]*`)/,
  symbol                 : /^(=>|=|\+|::|-|\*)/,
  keyword                : /^(var|let|const|return|switch|case|for|if|else|default|infuse|ensure|reduce)\b/,
  modulerename           : [/^as\s+([^\s]+)\s+from/, 'as ', ' from'],
  modulename             : [/^([A-z_]+)\s+from\b/, '', ' from'],
  boolean                : [/^(true|false)/],
  number                 : [/^(\d+)/],
  htmlopen               : [/^\<\\([A-z_-]+)/, '&lt;'],
  htmlclose              : [/^\<\\\/([A-z_-]+)/, '&lt;/'],
  destructure            : [/^\{([^\:\}\n]+)\}/, '{', '}'],
  objectkey              : [/^([^\s\:]+)\:/, '', ':']
};

window.addEventListener('load', () => {

  highlight({
    //patterns: patterns,
    patterns: block => {
      if (/javascript/.test(block.className)) {
        return patterns;
      }
    },
    linenums: true,
    postProcess: string => {
      return string.replace(/,/g, '<span class="comma">,</span>')
    }
  })

})
