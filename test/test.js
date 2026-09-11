import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log('__dirname:', __dirname)
const viewsPath = path.resolve(__dirname, '../src/views')
console.log('viewsPath:', viewsPath)

const env = nunjucks.configure(viewsPath, { autoescape: true })
env.addFilter('pad', (str, width) => String(str).padEnd(width))

// const data = {
//     action: `cssnr/best-action`,
//     tags: ['one', 'two'],
// }

const data = {
    // pypi_url: 'https://test.pypi.org',
    // extra_index_url: 'https://test.pypi.org/simple/',
    name: 'zipline-cli',
    prerelease: true,
    ref: '0.0.1b1',
}

const android = {
    version_name: '1.2.3',
    version_code: '999',
    package_id: 'org.cssnr.zipline',
}

// const res = nunjucks.render('action.jinja', data)
const res = nunjucks.render('pypi.jinja', data)
const ares = nunjucks.render('android.jinja', android)

console.log('data:', data)
console.log(`res: <START>\n${res}<END>`)
console.log('android:', android)
console.log(`ares: <START>\n${ares}<END>`)
