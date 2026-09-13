import nunjucks from 'nunjucks'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
nunjucks.configure(path.resolve(__dirname, '../src/views'), { autoescape: true })

const cases = [
  [{}, 'none'],
  [{ version_name: '1.2.3' }, 'name only'],
  [{ version_name: '1.2.3', version_code: '999' }, 'name+code'],
  [
    { version_name: '1.2.3', version_code: '999', package_id: 'org.cssnr.zipline' },
    'name+code+id',
  ],
  [{ package_id: 'org.cssnr.zipline' }, 'id only'],
]

for (const [data, label] of cases) {
  const res = nunjucks.render('android.jinja', data)
  console.log(`[${label}] -> ${JSON.stringify(res)}`)
}
