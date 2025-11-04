[![GitHub Tag Major](https://img.shields.io/github/v/tag/smashedr/update-release-notes-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/smashedr/update-release-notes-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/smashedr/update-release-notes-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/smashedr/update-release-notes-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/update-release-notes-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/smashedr/update-release-notes-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/smashedr/update-release-notes-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/smashedr/update-release-notes-action/blob/master/src)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/smashedr/update-release-notes-action/release.yaml?logo=cachet&label=release)](https://github.com/smashedr/update-release-notes-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/smashedr/update-release-notes-action/test.yaml?logo=cachet&label=test)](https://github.com/smashedr/update-release-notes-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/smashedr/update-release-notes-action/lint.yaml?logo=cachet&label=lint)](https://github.com/smashedr/update-release-notes-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=smashedr_update-release-notes-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=smashedr_update-release-notes-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/update-release-notes-action?logo=github&label=updated)](https://github.com/smashedr/update-release-notes-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/shaner/update-release-notes-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/shaner/update-release-notes-action)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/smashedr/update-release-notes-action?logo=github)](https://github.com/smashedr/update-release-notes-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/smashedr/update-release-notes-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/update-release-notes-action?logo=htmx)](https://github.com/smashedr/update-release-notes-action)
[![GitHub Discussions](https://img.shields.io/github/discussions/smashedr/update-release-notes-action?logo=github)](https://github.com/smashedr/update-release-notes-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/smashedr/update-release-notes-action?style=flat&logo=github)](https://github.com/smashedr/update-release-notes-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/smashedr/update-release-notes-action?style=flat&logo=github)](https://github.com/smashedr/update-release-notes-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Update Release Notes Action

- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

Update Release Notes Action. One Day...

## Inputs

| Input     |   Type    | Default&nbsp;Value | Input&nbsp;Description                   |
| :-------- | :-------: | :----------------- | :--------------------------------------- |
| location  |     -     | `head`             | Place at [`head`, `tail`]                |
| delimiter |     -     | -                  | String where to insert notes             |
| remove    |     -     | `false`            | Remove delimiter after insert            |
| update    |     -     | `true`             | Update Release Notes                     |
| summary   |     -     | `true`             | Add Summary to Job                       |
| token     |     -     | `github.token`     | For use with a PAT                       |
| type      |     -     | `generic`          | Type: [`actions`, `chrome-extension`] \* |
| issues    |   `all`   | `true`             | Append an Issues Link                    |
| tags      | `actions` | -                  | Actions Tags for Uses                    |

**type:** The type is parsed from the repository topics if not provided.

<details><summary>👀 View Example Notes for Type: actions</summary>

---

🚀 Use this release with these tags:

```text
smashedr/test-workflows@v1
smashedr/test-workflows@v1.0
smashedr/test-workflows@v1.0.2
```

❤️ Please [report any issues](https://github.com/smashedr/test-workflows/issues) you find.

---

</details>

<details><summary>👀 View Example Job Summary</summary>

---

🚀 We Did It Red It!

<details><summary>Release Notes</summary>

---

**Full Changelog**: https://github.com/smashedr/test-workflows/compare/v1.0.1...v1.0.2

🚀 Use this release with these tags:

```text
smashedr/test-workflows@v1
smashedr/test-workflows@v1.0
smashedr/test-workflows@v1.0.2
```

❤️ Please [report any issues](https://github.com/smashedr/test-workflows/issues) you find.

---

</details>
<details><summary>Config</summary><pre lang="yaml"><code>type: "actions"
tags: ["v1","v1.0","v1.0.2"]
location: "tail"
delimiter: ""
remove: false
summary: true
release_id: 205787094
tag_name: "v1.0.2"
repo: {"owner":"smashedr","repo":"test-workflows"}</code></pre>
</details>

---

</details>

With no inputs this will append a link to report issues.

```yaml
- name: 'Update Release Notes Action'
  uses: smashedr/update-release-notes-action@master
```

### Permissions

This action requires the following permissions to update release notes:

```yaml
permissions:
  contents: write
```

## Outputs

| Output | Description             |
| :----- | :---------------------- |
| body   | Full Release Notes Body |
| notes  | Generated Release Notes |

```yaml
- name: 'Update Release Notes Action'
  id: notes
  uses: smashedr/update-release-notes-action@master

- name: 'Echo Output'
  env:
    BODY: ${{ steps.notes.outputs.body }}
    NOTES: ${{ steps.notes.outputs.notes }}
  run: |
    echo "body: '${{ env.BODY }}'"
    echo "notes: '${{ env.NOTES }}'"
```

Note: due to the way `${{}}` expressions are evaluated, multi-line output gets executed in a run block.

## Examples

This is the [release.yaml](.github/workflows/release.yaml) workflow used by this Action.

```yaml
name: 'Release'

on:
  release:
    types: [published]

jobs:
  release:
    name: 'Release'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write

    steps:
      - name: 'Update Tags'
        id: tags
        uses: cssnr/update-version-tags-action@v1

      - name: 'Debug Tags'
        continue-on-error: true
        run: |
          echo "github.ref_name: ${{ github.ref_name }}"
          echo "steps.tags.outputs.tags: ${{ steps.tags.outputs.tags }}"

      - name: 'Update Release Notes Action'
        uses: smashedr/update-release-notes-action@master
        continue-on-error: true
        with:
          tags: ${{ steps.tags.outputs.tags }}
          location: tail
```

## Tags

The following rolling [tags](https://github.com/smashedr/update-release-notes-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                                             | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/smashedr/update-release-notes-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/smashedr/update-release-notes-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/smashedr/update-release-notes-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/smashedr/update-release-notes-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/smashedr/update-release-notes-action?style=for-the-badge&label=%20&color=red)](https://github.com/smashedr/update-release-notes-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/smashedr/update-release-notes-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/smashedr/update-release-notes-action/discussions/categories/q-a
- Request a Feature: https://github.com/smashedr/update-release-notes-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/smashedr/update-release-notes-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Release%20Notes)

# Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [Actions Up Action](https://github.com/cssnr/actions-up-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/create-files-action](https://github.com/cssnr/create-files-action?tab=readme-ov-file#readme) - Create various files from templates.
- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [js-test-action](https://github.com/smashedr/js-test-action?tab=readme-ov-file#readme) - JavaScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Python
- [ts-test-action](https://github.com/smashedr/ts-test-action?tab=readme-ov-file#readme) - TypeScript
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker Image

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
