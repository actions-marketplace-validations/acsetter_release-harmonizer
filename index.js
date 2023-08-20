module.exports = ({github, context, core, inputs}) => {
  function buildTagVersion() {
    var fullVersion = context.ref.match(/\d+(\.\d+)*/); // 'refs/tags/v1.23.4-beta' --> '1.23.4'
    if (fullVersion === null) {
      var errMessage = `Could not find a version number in the workflow context's 'ref': '${context.ref}'. 
        Make sure this action is invoked when a release is published and the release tag includes a version number.`;
      core.setFailed(errMessage);
      throw Error(errMessage)
    }
    var version = undefined

    switch (inputs.syncTo.toLowerCase()) {
      case 'major':
        version = fullVersion[0].match(/\d+/);
        break;
      case 'minor':
        version = fullVersion[0].match(/(\d+\.){1}\d+/);
        break;
      case 'patch':
        version = fullVersion[0].match(/(\d+\.){2}\d+/);
        break;
      case 'all':
        version = fullVersion;
        break;
    }

    if (version === undefined) {
      var errMessage = `Invalid input for 'sync-to'.\n
          Expected: 'major' | 'minor' | 'patch' | 'all' | 'none'\n
          But got: '${inputs.syncTo}'`;
      core.setFailed(errMessage);
      throw Error(errMessage);
    }

    if (version === null) {
      var errMessage = `Cannot sync-to '${inputs.syncTo}' because the version '${fullVersion}' 
        from the workflow context's ref '${context.ref}' has too few version sections.\n
        For reference: '1.2.3' translates to '<major>.<minor>.<patch>'.\n 
        If you believe this is a bug in the source code, please report via an opened issue in the repo.`;
      core.setFailed(errMessage);
      throw Error(errMessage);
    }
    
    return version[0];
  }

  async function syncRef(ref) {
    core.info(`Updating ref: ${{}}`)
    github.rest.git.updateRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref,
      sha: context.sha
    }).catch(error => {
      if (error.status === 422) {
        github.rest.git.createRef({
          owner: context.repo.owner,
          repo: context.repo.repo,
          ref: `refs/${ref}`,
          sha: context.sha
        });
      } else {
        core.setFailed(`${error.status}: ${error.message}`);
        throw error
      }
    });
  }

  var ref = '';
  if (inputs.refType.toLowerCase() === 'tag') {
    ref = `tags/${inputs.prefix}`;
  } else if (inputs.refType.toLowerCase() === 'branch') {
    ref = `heads/${inputs.prefix}`;
  } else {
    core.setFailed(`Invalid input for 'ref-type'.\nExpected: 'branch' or 'tag'\nActual: ${inputs.refType}`);
  }

  if (inputs.syncTo.toLowerCase() !== 'none') {
    ref += buildTagVersion();
  }

  syncRef(`${ref}${inputs.suffix}`)
}
