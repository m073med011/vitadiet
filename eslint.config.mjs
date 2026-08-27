import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Prettier self-closes void elements in Vue templates and exposes no option to stop,
    // so the default 'never' setting made `npm run lint` and `npm run format:check`
    // contradict each other on the same line. 'any' lets the formatter decide.
    'vue/html-self-closing': [
      'warn',
      {
        html: { void: 'any', normal: 'always', component: 'always' },
        svg: 'always',
        math: 'always',
      },
    ],
  },
})
