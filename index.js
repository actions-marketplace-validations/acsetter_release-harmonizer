module.exports = ({github, context, core, sha, inputs}) => {
  console.log(JSON.stringify(context));
  // var version = ''

  // if (inputs.syncTo === 'major') {

  // }


  // var ref = '';

  // if (inputs.refType === 'tag') {
  //   ref = `tags/${inputs.prefix}`;
  // } else if (inputs.refType === 'branch') {
  //   ref = `heads/${inputs.prefix}`;
  // } else {
  //   core.setFailed(`Invalid input for 'ref-type'.\nExpected: 'branch' or 'tag'\nActual: ${inputs.refType}`);
  // }

  // function formatVersionTag() {
  //   var tag = github.event.release.tag_name;
  // }

  async function syncRef(ref) {
    core.info(`Updating ref: ${{}}`)
    github.rest.git.updateRef({
      owner: context.repo.owner,
      repo: context.repo.repo,
      // ref,
      sha
    }).catch(error => {
      if (error.status === 422) {
        github.rest.git.createRef({
          owner: context.repo.owner,
          repo: context.repo.repo,
          // ref: `refs/${ref}`,
          sha
        });
      } else {
        core.setFailed(`${error.status}: ${error.message}`);
        throw error
      }
    });
  }

  // handle inputs and prep ref
  // syncRef(ref)
}