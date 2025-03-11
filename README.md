[![Tags](https://img.shields.io/badge/tags-v1_%7C_v1.0-blue?logo=git&logoColor=white)](https://github.com/smashedr/update-release-notes-action/tags)
[![GitHub Release Version](https://img.shields.io/github/v/release/smashedr/update-release-notes-action?logo=git&logoColor=white&label=latest)](https://github.com/smashedr/update-release-notes-action/releases/latest)
[![Release WF](https://img.shields.io/github/actions/workflow/status/smashedr/update-release-notes-action/release.yaml?logo=github&label=release)](https://github.com/smashedr/update-release-notes-action/actions/workflows/release.yaml)
[![Test WF](https://img.shields.io/github/actions/workflow/status/smashedr/update-release-notes-action/test.yaml?logo=github&label=test)](https://github.com/smashedr/update-release-notes-action/actions/workflows/test.yaml)
[![lint WF](https://img.shields.io/github/actions/workflow/status/smashedr/update-release-notes-action/lint.yaml?logo=github&label=lint)](https://github.com/smashedr/update-release-notes-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=smashedr_update-release-notes-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=smashedr_update-release-notes-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/smashedr/update-release-notes-action?logo=github&label=updated)](https://github.com/smashedr/update-release-notes-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/shaner/update-release-notes-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/shaner/update-release-notes-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/smashedr/update-release-notes-action?logo=htmx)](https://github.com/smashedr/update-release-notes-action)
[![GitHub Forks](https://img.shields.io/github/forks/smashedr/update-release-notes-action?style=flat&logo=github)](https://github.com/smashedr/update-release-notes-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/smashedr/update-release-notes-action?style=flat&logo=github)](https://github.com/smashedr/update-release-notes-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Update Release Notes Action

- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Support](#Support)
- [Contributing](#Contributing)

Update Release Notes Action. One Day...

## Inputs

| input     | required | default        | description                   |
| --------- | :------: | -------------- | ----------------------------- |
| tags      | **Yes**  | -              | Release Tags for Notes        |
| location  |    -     | `head`         | Place at [`head`, `tail`]     |
| delimiter |    -     | -              | String where to insert notes  |
| remove    |    -     | `false`        | Remove delimiter after insert |
| summary   |    -     | `true`         | Add Summary to Job            |
| token     |    -     | `github.token` | For use with a PAT [^1]       |

<details><summary>👀 View Example Job Summary</summary>

---

Coming Soon...

---

</details>

With no inputs this will do something. Soon...

```yaml
- name: 'Update Release Notes Action'
  uses: smashedr/update-release-notes-action@master
```

### Permissions

This action requires the following permissions:

```yaml
permissions:
  contents: write
```

## Outputs

| output | description             |
| ------ | ----------------------- |
| body   | Full Release Notes Body |
| notes  | Generated Release Notes |

```yaml
- name: 'Update Release Notes Action'
  id: test
  uses: smashedr/update-release-notes-action@master

- name: 'Echo Output'
  run: |
    echo "body: '${{ steps.test.outputs.body }}'"
```

## Examples

Coming Soon...

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/update-release-notes-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/update-release-notes-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/update-release-notes-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Release%20Notes)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
