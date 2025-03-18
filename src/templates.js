const action = `\
🚀 Use this release with these tags:

\`\`\`text
{{#each tags}}
{{../action}}@{{this}}
{{/each}}
\`\`\`
`

module.exports = { action }
