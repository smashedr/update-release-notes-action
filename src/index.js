const core = require('@actions/core')
const github = require('@actions/github')

;(async () => {
    try {
        core.info(`🏳️ Starting Update Release Notes Action`)

        // Debug
        core.startGroup('Debug: github.context')
        console.log(github.context)
        core.endGroup() // Debug github.context
        core.startGroup('Debug: process.env')
        console.log(process.env)
        core.endGroup() // Debug process.env

        // Get Inputs
        const inputs = getInputs()
        core.startGroup('Parsed Inputs')
        console.log(inputs)
        core.endGroup() // Inputs

        // Get Context
        // const { owner, repo } = github.context.repo
        const { owner, repo } = { owner: 'smashedr', repo: 'test-action' }
        core.info(`owner: ${owner}`)
        core.info(`repo: ${repo}`)
        const release_id = github.context.payload.release.id
        console.log('release_id:', release_id)

        core.info('⌛ Processing...')

        // Generate Notes
        console.log('tags:', inputs.tags)
        const notes = '```text\n' + `${inputs.tags.join('\n')}` + '\n```'
        console.log('notes:', JSON.stringify(notes))

        // Get Release
        const octokit = github.getOctokit(inputs.token)
        const release = await octokit.rest.repos.getRelease({
            owner,
            repo,
            release_id,
        })
        // console.log('release:', release)
        console.log('release.data.body:', JSON.stringify(release.data.body))

        // Generate Release Body
        let body
        if (inputs.delimiter) {
            if (!release.data.body.includes(inputs.delimiter)) {
                return core.setFailed(
                    `Delimiter not found in release body: ${inputs.delimiter}`
                )
            }
            const [head, tail] = release.data.body.split(inputs.delimiter)
            console.log('head:', head)
            console.log('tail:', tail)
            if (inputs.remove) {
                body = head + notes + tail
            } else if (inputs.location === 'head') {
                body = head + notes + '\n' + inputs.delimiter + tail
            } else {
                body = head + inputs.delimiter + '\n' + notes + tail
            }
        } else if (inputs.location === 'head') {
            body = notes + '\n' + release.data.body
        } else {
            body = release.data.body + '\n' + notes
        }
        console.log('body:', body)

        // Update Release
        await octokit.rest.repos.updateRelease({
            owner,
            repo,
            release_id,
            body,
        })

        // Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('body', body)
        core.setOutput('notes', notes)

        // Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            await addSummary(inputs, body)
        }

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Get Inputs
 * @return {{tags: string[], location: string, delimiter: string, remove: boolean, summary: boolean, token: string}}
 */
function getInputs() {
    return {
        tags: core.getInput('tags', { required: true }).split(','),
        location: core.getInput('location', { required: true }),
        delimiter: core.getInput('delimiter'),
        remove: core.getBooleanInput('remove'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),
    }
}

/**
 * Add Summary
 * @param {Object} inputs
 * @param {String} body
 * @return {Promise<void>}
 */
async function addSummary(inputs, body) {
    core.summary.addRaw('## Update Release Notes Action\n')
    core.summary.addDetails('Release Notes', `\n\n${body}\n\n---\n\n`)

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
