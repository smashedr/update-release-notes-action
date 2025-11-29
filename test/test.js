const path = require('node:path')
const nunjucks = require('nunjucks')

console.log('__dirname:', __dirname)
const viewsPath = path.resolve(__dirname, '../src/views')
console.log('viewsPath:', viewsPath)

nunjucks.configure(viewsPath, { autoescape: true })

// const data = {
//     action: `cssnr/best-action`,
//     tags: ['one', 'two'],
// }

const data = {
    name: 'zipline-cli',
    prerelease: false,
}

// const res = nunjucks.render('action.jinja', data)
const res = nunjucks.render('pypi.jinja', data)

console.log(`res: <START>\n${res}<END>`)
