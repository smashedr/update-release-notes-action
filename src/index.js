const path = require('node:path')
const core = require('@actions/core')
const github = require('@actions/github')
const nunjucks = require('nunjucks')
const yaml = require('js-yaml')

// Setup
console.log('__dirname:', __dirname)
const viewsPath = path.resolve(__dirname, '../src/views')
console.log('viewsPath:', viewsPath)
nunjucks.configure(viewsPath, { autoescape: true })

async function main() {
    core.info(`🏳️ Starting Update Release Notes Action`)

    // // Debug
    // core.startGroup('Debug: github.context')
    // console.log(github.context)
    // core.endGroup() // Debug github.context
    // core.startGroup('Debug: process.env')
    // console.log(process.env)
    // core.endGroup() // Debug process.env

    // Debug
    core.startGroup('Debug')
    console.log('github.context.repo:', github.context.repo)
    console.log('github.context.eventName:', github.context.eventName)
    console.log('github.context.ref:', github.context.ref)
    console.log('github.context.payload.release.id:', github.context.payload.release?.id)
    core.endGroup() // Debug

    if (github.context.eventName !== 'release') {
        return core.warning(`Skipping event: ${github.context.eventName}`)
    }
    if (!github.context.payload.release?.id) {
        return core.setFailed('Missing: github.context.payload.release.id')
    }

    // Get Inputs
    const inputs = getInputs()
    core.startGroup('Parsed Inputs')
    console.log(inputs)
    core.endGroup() // Inputs

    core.info(`⌛ Processing type: \u001b[33;1m${inputs.type}`)

    /** @type {import("@octokit/rest").Octokit} */
    const octokit = github.getOctokit(inputs.token)

    // Get Releases
    // const [current, previous] = await getReleases(inputs, octokit)
    // console.log('current:', current)
    // console.log('previous:', previous)
    const release = await octokit.rest.repos.getRelease({
        ...github.context.repo,
        release_id: github.context.payload.release.id,
    })
    console.log('release.status:', release.status)
    if (!release?.data) {
        return core.setFailed('Current Release Not Found!')
    }
    // core.startGroup('Current Release Body')
    // core.info(release.data.body)
    // core.endGroup() // Current Release Body

    // Generate Additional Notes
    core.startGroup(`Generate Notes for: \u001b[33;1m${inputs.type}`)
    let notes = ''
    if (inputs.type === 'actions') {
        notes = genActionsNotes(inputs)
    } else if (inputs.type === 'pypi') {
        notes = genPyPiNotes(inputs)
    } else if (inputs.type === 'chrome-extension') {
        core.warning('Not Yet Implemented: chrome-extension')
    }
    // Generate Issue Notes
    if (inputs.issues) {
        core.info('Appending Issue Link to Notes')
        notes += addIssueNotes()
    }
    core.endGroup() // Generate Notes

    core.startGroup('Generated Release Notes')
    core.info(notes)
    core.endGroup() // Generated Release Notes

    // Update Release Body
    core.startGroup('Update Release Body')
    const body = updateBody(inputs, release.data.body, notes)
    core.info(body)
    core.endGroup() // Update Release Body

    // Update Release
    if (inputs.update) {
        const res = await octokit.rest.repos.updateRelease({
            ...github.context.repo,
            release_id: github.context.payload.release.id,
            body,
        })
        console.log('res.status:', res.status)
    } else {
        core.info('⏩ \u001b[33;1mSkipping Release Notes Update')
    }

    // Outputs
    core.info('📩 Setting Outputs')
    core.setOutput('body', body)
    core.setOutput('notes', notes)

    // Summary
    if (inputs.summary) {
        core.info('📝 Writing Job Summary')
        try {
            await addSummary(inputs, body)
        } catch (e) {
            console.log(e)
            core.error(`Error writing Job Summary: ${e.message}`)
        }
    }

    core.info(`✅ \u001b[32;1mFinished Success`)
}

/**
 * Generate PyPi Notes
 * @param {Object} inputs
 * @return {string}
 */
function genPyPiNotes(inputs) {
    // const data = parseData(inputs.pypi)
    console.log('data:', inputs.pypi)
    inputs.pypi.ref = process.env.GITHUB_REF_NAME
    const result = nunjucks.render('pypi.jinja', inputs.pypi)
    console.log('result:', result)
    return result
}

/**
 * Generate Actions Notes
 * @param {Object} inputs
 * @return {string}
 */
function genActionsNotes(inputs) {
    if (!inputs.actions.tags?.length && !inputs.tags.length) {
        console.log('Skipping Actions Notes: No tags')
        return ''
    }
    console.log('Generating Actions Notes')
    const tags = splitTrim(inputs.actions.tags || inputs.tags)
    if (!tags.includes(github.context.payload.release.tag_name)) {
        console.log('Adding tag:', github.context.payload.release.tag_name)
        tags.push(github.context.payload.release.tag_name)
    }
    console.log('Adding tag:', github.context.sha)
    tags.push(`${github.context.sha} # ${github.context.payload.release.tag_name}`)

    const data = {
        action: `${github.context.repo.owner}/${github.context.repo.repo}`,
        tags,
    }
    console.log('data:', data)
    const result = nunjucks.render('action.jinja', data)
    console.log('result:', result)
    return result

    // let images = []
    // for (const tag of inputs.tags) {
    //     console.log('tag:', tag)
    //     images.push(`${github.context.repo.owner}/${github.context.repo.repo}@${tag}`)
    // }
    // console.log('images:', images)
    //
    // let notes = '🚀 Use this release one of these tags:\n\n'
    // notes += '```text\n' + `${images.join('\n')}` + '\n```'
    // return notes
}

function addIssueNotes() {
    const url = `${github.context.payload.repository.html_url}/issues`
    return `\n❤️ Please [report any issues](${url}) you find.`
}

function updateBody(inputs, body, notes) {
    let result
    if (inputs.delimiter) {
        if (!body.includes(inputs.delimiter)) {
            throw new Error(`Delimiter not found in release body: ${inputs.delimiter}`)
        }
        const [head, tail] = body.split(inputs.delimiter)
        console.log('head:', JSON.stringify(head))
        console.log('tail:', JSON.stringify(tail))
        if (inputs.remove) {
            result = head + '\n\n' + notes + '\n\n' + tail
        } else if (inputs.location === 'head') {
            result = head + '\n\n' + notes + '\n\n' + inputs.delimiter + tail
        } else {
            result = head + inputs.delimiter + '\n\n' + notes + '\n\n' + tail
        }
    } else if (inputs.location === 'head') {
        result = notes + '\n\n' + body
    } else {
        result = body + '\n\n' + notes
    }
    return result
}

// /**
//  * Get Current and Previous Release
//  * @param inputs
//  * @param octokit
//  * @return {Promise<[Object|undefined, Object|undefined]>}
//  */
// async function getReleases(inputs, octokit) {
//     const releases = await octokit.rest.repos.listReleases({
//         ...github.context.repo,
//     })
//     // core.startGroup('Last 30 Releases (debugging)')
//     // console.log(releases.data)
//     // core.endGroup() // Releases
//
//     let previous
//     let current
//     let found = 0
//     for (const release of releases.data) {
//         // console.debug('release:', release)
//         if (found) {
//             previous = release
//             break
//         }
//         if (release.id === github.context.payload.release.id) {
//             current = release
//             found = 1
//         }
//     }
//     return [current, previous]
// }

/**
 * Add Summary
 * @param {Object} inputs
 * @param {String} body
 * @return {Promise<void>}
 */
async function addSummary(inputs, body) {
    core.summary.addRaw('## Update Release Notes Action\n\n')
    core.summary.addRaw('🚀 We Did It Red It!\n\n')
    core.summary.addDetails('Release Notes', `\n\n---\n\n${body}\n\n---\n\n`)

    delete inputs.token
    const yaml = Object.entries(inputs)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/smashedr/update-release-notes-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Parse JSON/YAML Data from a String
 * @param {string} data
 * @return {object}
 */
function parseData(data) {
    core.debug(`parseData: ${typeof data}: ${data}`)
    // console.log(`parseData: ${typeof data}: ${data}`)
    if (!data) return {}
    try {
        return JSON.parse(data)
    } catch (e) {
        core.debug(`JSON.parse failed: ${e.message}`)
        // console.log(`JSON.parse failed: ${e.message}`)
    }
    try {
        return yaml.load(data)
    } catch (e) {
        core.debug(`yaml.load failed: ${e.message}`)
        // console.log(`yaml.load failed: ${e.message}`)
    }
    throw new Error(`Unable to parse data: ${data}`)
}

function splitTrim(value) {
    return value
        .split(/[\r\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s !== '')
}

/**
 * Get Inputs
 * @typedef {object} Inputs
 * @property {string} type
 * @property {string[]} topics
 * @property {object} actions
 * @property {object} pypi
 * @property {boolean} issues
 * @property {string} location
 * @property {string} delimiter
 * @property {boolean} remove
 * @property {boolean} update
 * @property {boolean} summary
 * @property {string} token
 * @return Inputs
 */
function getInputs() {
    const actions = core.getInput('actions')
    const pypi = core.getInput('pypi')

    const topics = github.context.payload.repository.topics || []
    let type = core.getInput('type')
    if (!type) {
        if (actions) {
            type = 'actions'
        } else if (pypi) {
            type = 'pypi'
        }
    }
    if (!type) {
        if (topics?.includes('actions')) {
            type = 'actions'
        } else if (topics?.includes('pypi')) {
            type = 'pypi'
        } else if (topics?.includes('chrome-extension')) {
            type = 'chrome-extension'
        } else {
            type = 'generic'
            core.warning('Unknown Type. Using generic type.')
        }
    }
    return {
        type,
        topics,
        actions: parseData(actions),
        pypi: parseData(pypi),
        issues: core.getBooleanInput('issues'),
        location: core.getInput('location', { required: true }),
        delimiter: core.getInput('delimiter'),
        remove: core.getBooleanInput('remove'),
        update: core.getBooleanInput('update'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),
        tags: core.getInput('tags'),
    }
}

main().catch((e) => {
    core.debug(e)
    core.info(e.message)
    core.setFailed(e.message)
})
