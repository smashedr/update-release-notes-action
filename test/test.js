const path = require('node:path')
const nunjucks = require('nunjucks')

console.log('__dirname:', __dirname)
const viewsPath = path.join(__dirname, 'views')
console.log('viewsPath:', viewsPath)

nunjucks.configure(viewsPath, { autoescape: true })

const data = {
    action: `cssnr/best-action`,
    tags: ['one', 'two'],
}

const res = nunjucks.render('action.jinja', data)

console.log(`res: "${res}"`)
