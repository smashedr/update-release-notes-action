const core = require('@actions/core')
const github = require('@actions/github')
const Handlebars = require('handlebars')

import { action } from './templates'

// main
;(async () => {
    try {
        core.info(`🏳️ Starting Update Release Notes Action`)

        // Extra Debug
        core.startGroup('Debug: github.context')
        console.log(github.context)
        core.endGroup() // Debug github.context
        core.startGroup('Debug: process.env')
        console.log(process.env)
        core.endGroup() // Debug process.env

        // Debug
        core.startGroup('Debug')
        console.log('GITHUB_REF_NAME:', process.env.GITHUB_REF_NAME)
        console.log('github.context.ref:', github.context.ref)
        console.log('github.context.eventName:', github.context.eventName)
        // const topics = github.context.payload.repository.topics
        // console.log('topics:', topics)
        core.endGroup() // Debug

        if (github.context.eventName !== 'release') {
            return core.warning(`Skipping event: ${github.context.eventName}`)
        }
        if (github.context.payload.release.prerelease) {
            return core.warning(`Skipping prerelease.`)
        }

        // Get Config
        const config = getConfig()
        core.startGroup('Parsed Config')
        console.log(config)
        core.endGroup() // Config

        core.info(`⌛ Processing type: \u001b[33;1m${config.type}`)

        const octokit = github.getOctokit(config.token)

        // // Get Release
        // const release = await octokit.rest.repos.getRelease({
        //     owner,
        //     repo,
        //     release_id,
        // })
        // // console.log('release:', release)
        // console.log('release.data.body:\n', JSON.stringify(release.data.body))

        // Get Releases
        const [current, previous] = await getReleases(config, octokit)

        core.startGroup('Previous Releases (not used)')
        console.log(previous)
        core.endGroup() // Previous Releases

        core.startGroup('Current Releases')
        console.log(current)
        core.endGroup() // Current Releases

        if (!current) {
            return core.setFailed('Current Release Not Found!')
        }
        core.startGroup('Current Release Body')
        core.info(current.body)
        core.endGroup() // Current Release Body

        // Generate Additional Notes
        core.startGroup(`Generate Notes for: ${config.type}`)
        let notes
        if (config.type === 'actions') {
            notes = genActionsNotes(config)
        } else if (config.type === 'chrome-extension') {
            return core.setFailed('Not Yet Implemented: chrome-extension')
        }
        notes += addIssueNotes()
        core.endGroup() // Generate Notes

        core.startGroup('Generated Release Notes')
        core.info(notes)
        core.endGroup() // New Release Notes

        // Update Release Body
        core.startGroup('New Release Body')
        const body = updateBody(config, current.body, notes)
        core.info(body)
        core.endGroup()

        // Update Release
        await octokit.rest.repos.updateRelease({
            ...config.repo,
            release_id: config.release_id,
            body,
        })

        // Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('body', body)
        core.setOutput('notes', notes)

        // Summary
        if (config.summary) {
            core.info('📝 Writing Job Summary')
            await addSummary(config, body)
        }

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Generate Actions Notes
 * @param {Object} config
 * @return {string}
 */
function genActionsNotes(config) {
    if (!config.tags.includes(config.tag_name)) {
        console.log('Adding tag:', config.tag_name)
        config.tags.push(config.tag_name)
    }

    const data = {
        action: `${config.repo.owner}/${config.repo.repo}`,
        tags: config.tags,
    }
    console.log('data:', data)
    const template = Handlebars.compile(action)
    const result = template(data)
    console.log('result:', result)
    return result

    // let images = []
    // for (const tag of config.tags) {
    //     console.log('tag:', tag)
    //     images.push(`${config.repo.owner}/${config.repo.repo}@${tag}`)
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

function updateBody(config, body, notes) {
    let result
    if (config.delimiter) {
        if (!body.includes(config.delimiter)) {
            throw new Error(
                `Delimiter not found in release body: ${config.delimiter}`
            )
        }
        const [head, tail] = body.split(config.delimiter)
        console.log('head:', JSON.stringify(head))
        console.log('tail:', JSON.stringify(tail))
        if (config.remove) {
            result = head + '\n\n' + notes + '\n\n' + tail
        } else if (config.location === 'head') {
            result = head + '\n\n' + notes + '\n\n' + config.delimiter + tail
        } else {
            result = head + config.delimiter + '\n\n' + notes + '\n\n' + tail
        }
    } else if (config.location === 'head') {
        result = notes + '\n\n' + body
    } else {
        result = body + '\n\n' + notes
    }
    // console.log('updated release body:\n', result)
    return result
}

/**
 * Get Current and Previous Release
 * @param config
 * @param octokit
 * @return {Promise<[Object, Object]>}
 */
async function getReleases(config, octokit) {
    const releases = await octokit.rest.repos.listReleases({
        ...config.repo,
    })
    core.startGroup('Last 30 Releases (debugging)')
    console.log(releases.data)
    core.endGroup() // Releases

    let previous
    let current
    let found = 0
    for (const release of releases.data) {
        // console.debug('release:', release)
        if (found) {
            previous = release
            break
        }
        if (release.id === config.release_id) {
            current = release
            found = 1
        }
    }
    return [current, previous]
}

/**
 * Get Config
 * @return {{ tags: string[], location: string, delimiter: string, remove: boolean, summary: boolean, token: string, release_id: number, tag_name: string, repo: {owner: string, repo: string}, topics: string[], type: string }}
 */
function getConfig() {
    const topics = github.context.payload.repository.topics
    let type = core.getInput('type')
    if (!type) {
        if (topics.includes('actions')) {
            type = 'actions'
        } else if (topics.includes('chrome-extension')) {
            type = 'chrome-extension'
        }
        if (!type) {
            throw new Error(`Unable to parse type from topics.`)
        }
    }
    return {
        tags: core.getInput('tags', { required: true }).split(','),
        location: core.getInput('location', { required: true }),
        delimiter: core.getInput('delimiter'),
        remove: core.getBooleanInput('remove'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),

        release_id: github.context.payload.release.id,
        tag_name: github.context.payload.release.tag_name,
        repo: { ...github.context.repo },
        // repo: { owner: 'smashedr', repo: 'test-workflows' },
        topics,
        type,
    }
}

/**
 * Add Summary
 * @param {Object} config
 * @param {String} body
 * @return {Promise<void>}
 */
async function addSummary(config, body) {
    core.summary.addRaw('## Update Release Notes Action\n\n')
    core.summary.addRaw('🚀 We Did It Red It!\n\n')
    core.summary.addDetails('Release Notes', `\n\n---\n\n${body}\n\n---\n\n`)

    delete config.token
    const yaml = Object.entries(config)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Config</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/smashedr/update-release-notes-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}
