# Release Harmonizer
A GitHub Action that syncs branches and/or tags to a published release. After a release is creted, this action creates/updates branches and/or tags that point to the head commit of the new release. If you wish to include a version number in the new ref, the published release's tag must include a version number. For example, 'v1.2.3', '1.2.3', '2.1-beta', and 'v2.1.3.6-alpha' are all acceptble tags to sync with.

> [!IMPORTANT]
> This action is only meant to be consumed in a workflow that is triggered by a publish event. [Learn more](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows).

## Usage
```yaml
on:
  release:
    type: [published]
jobs:
  sync-refs:
    runs-on: ubuntu-latest
    permissions:
      # set the contents: write permission if using the GITHUB_TOKEN
      contents: write
    steps:
      - uses: acsetter/release-harmonizer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

          # ('tag' | 'branch') which type of ref to sync.
          ref-type: ''
          
          # ('major' | 'minor' | 'patch' | 'full' | 'all') Determines how refs are
          # synced with the release. For example, if 'major' is specified, versions
          # starting at 1.0.0 and up to, but not including, 2.0.0 will be synced to
          # the same ref. Versions higher than 2.0.0 will create a new ref. Default
          # is 'major'.
          #  - 'major' syncs releases [1.0.0, 2.0.0) to the ref '<prefix>1<suffix>'
          #  - 'minor' syncs releases [1.1.0, 1.2.0) to the ref '<prefix>1.1<suffix>'
          #  - 'patch' syncs releases [2.0.1, 2.0.2) to the ref '<prefix>2.0.1<suffix>'
          #  - 'full' syncs release '1.2.3.4' to the ref '<prefix>1.2.3.4<suffix>'
          #  - 'all' syncs all releases to the ref '<prefix><suffix>'
          sync-to: ''

          # (string) The prefix for the ref-name. For example, the prefeix 'foo/bar'
          # would produce branches 'foo/bar1', 'foo/bar2', and 'foo/bar3' when synced
          # to major with a ref-type of 'branches'.
          prefix: ''

          # (string) The suffix for the ref-name. For example, the suffix -latest
          # would produce refs 'v1.0-latest', 'v1.1-latest', and 'v2.2-latest'
          # when synced to minor with the prefix 'v'.
          suffix: ''
```

## Examples
The following workflow is an example of how to automatically sync major versions to a `v#` tag when a versioned release is published:
```yaml
name: 🏷️ Sync Major Tag

on:
  release:
    types: 
      - published 

jobs:
  harmonizer:
    name: 🔃 Run Harmonizer
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: 🗃️ Checkout
        uses: actions/checkout@v3

      - name: 🔃 Sync Tag
        uses: acsetter/release-harmonizer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          ref-type: tag
          sync-to: major
          prefix: v
```
With this workflow in your `.github/workflows` folder, the latest releases, versioned `1.0.0` up to, but not including, `2.0.0`, will automatically be synced to the tag `v1`. When version `2.0.0` is published, it will automatically be synced to the tag `v2`. 😎

> [!NOTE]
> If the branch or tag you are trying to sync to has protections enabled, you may need to provide a token with administrator provilleges.
