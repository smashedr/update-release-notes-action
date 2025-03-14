const action = `\
🚀 Use this release with tags:

\`\`\`text
{{#each tags}}
{{../action}}@{{this}}
{{/each}}
\`\`\`
`

module.exports = { action }
