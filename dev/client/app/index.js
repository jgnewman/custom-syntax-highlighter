import highlight from '../../../bin/index';

const patterns = [
  {
    name: 'comment linecomment',
    match: /^(\/\/[^\/\n]*)/
  },
  {
    name: 'comment blockcomment',
    match: /^(\/\*.*\*\/)/
  },
  {
    name: 'singlequote',
    match: /^(\'[^\'\n]*\')/
  },
  {
    name: 'doublequote',
    match: /^(\"[^\"\n]*\")/
  },
  {
    name: 'backquote',
    match: /^(\`[^\`]*`)/
  },
  {
    name: 'symbol',
    match: /^(=>|=|\+|::|-|\*)/
  },
  {
    name: 'keyword',
    match: /^(var|let|const|return|switch|case|for|if|else|default|infuse|ensure|reduce)\b/
  },
  {
    name: 'modulerename',
    match: [/^as\s+([^\s]+)\s+from/, 'as ', ' from']
  },
  {
    name: 'modulename',
    match: [/^([A-z_]+)\s+from\b/, '', ' from']
  },
  {
    name: 'boolean',
    match: [/^(true|false)/]
  },
  {
    name: 'number',
    match: [/^(\d+)/]
  },
  {
    name: 'htmlopen',
    match: [/^\<\\([A-z_-]+)/, '&lt;']
  },
  {
    name: 'htmlclose',
    match: [/^\<\\\/([A-z_-]+)/, '&lt;/']
  },
  {
    name: 'destructure',
    match: [/^\{([^\:\}\n]+)\}/, '{', '}']
  },
  {
    name: 'objectkey',
    match: [/^([^\s\:]+)\:/, '', ':']
  }
];

window.addEventListener('load', () => {

  window.csHighlight({
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
