"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = require("@actions/core");
const github = require("@actions/github");
const client_1 = require("./client");
const token = core.getInput('TOKEN');
const notionApiKey = core.getInput('NOTION_API_KEY');
const notionDatabase = core.getInput('NOTION_DATABASE');
const run = async () => {
    if (!token)
        throw new Error('Github token not found');
    if (!notionApiKey)
        throw new Error('Notion API Key not found');
    if (!notionDatabase)
        throw new Error('Notion Database ID not found');
    const client = (0, client_1.instance)(notionApiKey);
    if (github.context.eventName === 'push') {
        const pushPayload = github.context.payload;
        pushPayload.commits.forEach(commit => {
            const ref = pushPayload.ref.split('/');
            const header = `[${pushPayload.organization}/${pushPayload.repository}:${ref[ref.length - 1]}]`;
            const message = `${header} ${commit.message} - ${commit.author.name}`;
            const code = commit.message.match(/#\w*/);
            if (!code || !code[0])
                return;
            const issues = findIssue(client, code[0]);
            issues.then(response => {
                if (!response.data)
                    return;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const pageId = response.data.results[0].id;
                writeCommitHistory(client, pageId, message, commit.url);
            });
            core.info(`commit is: ${code[0]} - ${message}`);
        });
    }
};
exports.run = run;
const findIssue = async (client, code) => await client.post(`/v1/databases/${notionDatabase}/query`, {
    filter: {
        property: 'ISSUE_CODE',
        formula: {
            text: {
                equals: code,
            },
        },
    },
});
const writeCommitHistory = async (client, pageId, message, link) => await client.patch(`/v1/blocks/${pageId}/children`, {
    children: [
        {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                text: [
                    {
                        type: 'text',
                        text: { content: message, link: { url: link } },
                    },
                ],
            },
        },
    ],
});
(0, exports.run)()
    .then(() => { })
    .catch(err => {
    console.log('ERROR', err);
    core.setFailed(err.message);
});
//# sourceMappingURL=index.js.map