# Release Harmonizer

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
          
          # ('major' | 'minor' | 'patch' | 'all' | 'none') Determines how refs are
          # synced with the release. For example, if 'major' is specified, versions
          # starting at 1.0.0 and up to, but not including, 2.0.0 will be synced to
          # the same ref. Versions higher than 2.0.0 will create a new ref.
          #  - 'major' syncs [1.0.0, 2.0.0)
          #  - 'minor' syncs [1.1.0, 1.2.0)
          #  - 'patch' syncs [2.0.1, 2.0.2)
          #  - 'all' creates a new ref every version bump
          #  - 'none' syncs to a ref made of prefixes and/or suffixes with no version
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
```yaml

```
