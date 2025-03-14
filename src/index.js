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
        const topics = github.context.payload.repository.topics
        console.log('topics:', topics)
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

        if (!config.type) {
            if (topics.includes('actions')) {
                config.type = 'actions'
            } else if (topics.includes('chrome-extension')) {
                config.type = 'chrome-extension'
            }
            if (!config.type) {
                return core.warning(`Unable to parse type from topics.`)
            }
        }

        core.info(`⌛ Processing type: \u001b[33;1m${config.type}`)

        // Get Context
        // const { owner, repo } = github.context.repo
        // core.info(`owner: ${owner}`)
        // core.info(`repo: ${repo}`)
        // const release_id = github.context.payload.release.id
        // console.log('release_id:', release_id)
        // const tag_name = github.context.payload.release.tag_name
        // console.log('tag_name:', tag_name)

        const octokit = github.getOctokit(config.token)

        // Get Releases
        const releases = await octokit.rest.repos.listReleases({
            ...config.repo,
        })
        core.startGroup('Last 30 Releases')
        console.log(releases.data)
        core.endGroup() // Releases

        let previousRelease
        let currentRelease
        let found = 0
        for (const release of releases.data) {
            // console.debug('release:', release)
            if (found) {
                previousRelease = release
                break
            }
            if (release.id === config.release_id) {
                currentRelease = release
                found = 1
            }
        }

        core.startGroup('Previous Releases')
        console.log(previousRelease)
        core.endGroup() // Previous Releases

        core.startGroup('Current Releases')
        console.log(currentRelease)
        core.endGroup() // Current Releases

        if (!currentRelease) {
            return core.setFailed('Current Release Not Found!')
        }
        core.startGroup('Current Release Body')
        core.info(currentRelease.body)
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

        // // Get Release
        // const release = await octokit.rest.repos.getRelease({
        //     owner,
        //     repo,
        //     release_id,
        // })
        // // console.log('release:', release)
        // console.log('release.data.body:\n', JSON.stringify(release.data.body))

        // Update Release Body
        let body
        if (config.delimiter) {
            if (!currentRelease.body.includes(config.delimiter)) {
                return core.setFailed(
                    `Delimiter not found in release body: ${config.delimiter}`
                )
            }
            const [head, tail] = currentRelease.body.split(config.delimiter)
            console.log('head:', JSON.stringify(head))
            console.log('tail:', JSON.stringify(tail))
            if (config.remove) {
                body = head + '\n\n' + notes + '\n\n' + tail
            } else if (config.location === 'head') {
                body = head + '\n\n' + notes + '\n\n' + config.delimiter + tail
            } else {
                body = head + config.delimiter + '\n\n' + notes + '\n\n' + tail
            }
        } else if (config.location === 'head') {
            body = notes + '\n\n' + currentRelease.body
        } else {
            body = currentRelease.body + '\n\n' + notes
        }
        // console.log('updated release body:\n', body)
        core.startGroup('New Release Body')
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

/**
 * Get Config
 * @return {{type: string, tags: string[], location: string, delimiter: string, remove: boolean, summary: boolean, token: string, release_id: number, tag_name: string, repo: {owner: string, repo: string}}}
 */
function getConfig() {
    return {
        type: core.getInput('type'),
        tags: core.getInput('tags', { required: true }).split(','),
        location: core.getInput('location', { required: true }),
        delimiter: core.getInput('delimiter'),
        remove: core.getBooleanInput('remove'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),

        release_id: github.context.payload.release.id,
        tag_name: github.context.payload.release.tag_name,
        // repo: { ...github.context.repo },
        repo: { owner: 'smashedr', repo: 'test-workflows' }, // TODO DEBUG REMOVE
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
