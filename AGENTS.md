# Agent Guide

A GitHub Action to update GitHub Release Notes.

- [src](src) - is the source directory
- [src/index.js](src/index.js) - single source file
- [dist](dist) - built by rollup, committed and pushed to remote

## Commands

ALWAYS use the `npm run *` command

| Command            | Purpose                                 |
| ------------------ | --------------------------------------- |
| `npm run build`    | Rollup `src/index.ts` → `dist/index.js` |
| `npm run lint`     | ESLint on `src/`                        |
| `npm run prettier` | ALWAYS RUN AFTER EDITING FILES          |
