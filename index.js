module.exports = ({github, context, core, sha, inputs}) => {
  var test = core.getInput('prefix');
  console.log(test)
  console.log(JSON.stringify(inputs))
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