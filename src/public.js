const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

// ************************************************
async function queryIssues(owner, repo, since, page = 1) {
  let { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    since,
    per_page: 100,
    page,
  });
  if (issues.length >= 100) {
    issues = issues.concat(await queryIssues(owner, repo, since, page + 1));
  }
  return issues;
}

function formatTitle(excludes, title) {
  if (excludes.length == 0) {
    return title;
  }
  excludes.forEach(ex => {
    title = title.replace(ex, '');
  });
  return title.trim();
}

async function doIssueComment(owner, repo, number, issues, commentTitle, commentBody, FIXCOMMENT) {
  const comments = await listComments(owner, repo, number);
  const filterComments = [];
  comments.forEach(comment => {
    if (comment.body.includes(FIXCOMMENT)) {
      filterComments.push(comment.id);
    }
  });
  if (filterComments.length > 1) {
    core.info(`Error: filterComments length is ${filterComments.length}.`);
    return false;
  }
  const title = commentTitle || `### Issues Similarity Analysis:`;
  let body = '';
  issues.forEach((iss, index) => {
    if (commentBody) {
      let temp = commentBody;
      temp = temp.replace('${number}', iss.number);
      temp = temp.replace('${title}', iss.title);
      temp = temp.replace('${similarity}', iss.similarity.toFixed(2) * 100 + '%');
      temp = temp.replace('${index}', index + 1);
      body += `${temp}
`;
    } else {
      body += `- [#${iss.number}][${iss.title}][${iss.similarity.toFixed(2) * 100 + '%'}]
`;
    }
  });

  const showFooter = core.info('show-footer') || 'true';

  const footer =
    showFooter === 'true'
      ? `<sub>🤖 By [issues-similarity-analysis](https://github.com/actions-cool/issues-similarity-analysis)</sub>

${FIXCOMMENT}
`
      : `
${FIXCOMMENT}
`;

  if (filterComments.length == 0) {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: title + '\n' + body + '\n' + footer,
    });
    core.info(`Actions: [create-comment][${number}] success!`);
  } else {
    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: filterComments[0],
      body: title + '\n' + body + '\n' + footer,
    });
    core.info(`Actions: [update-comment][${number}] success!`);
  }
}

async function listComments(owner, repo, number, page = 1) {
  let { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: number,
    per_page: 100,
    page,
  });
  if (comments.length >= 100) {
    comments = comments.concat(await listComments(owner, repo, number, page + 1));
  }
  return comments;
}

// ************************************************
module.exports = {
  queryIssues,
  formatTitle,
  doIssueComment,
};
