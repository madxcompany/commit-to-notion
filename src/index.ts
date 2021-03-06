import * as core from '@actions/core';
import * as github from '@actions/github';
import {PushEvent} from '@octokit/webhooks-definitions/schema';
import {instance} from './client';
import {AxiosInstance} from 'axios';
import {Block} from './types/block';
import {Response} from './types/response';

const token = core.getInput('GITHUB_TOKEN');
const notionApiKey = core.getInput('NOTION_API_KEY');
const notionDatabase = core.getInput('NOTION_DATABASE');

export const run = async () => {
  if (!token) throw new Error('Github token not found');
  if (!notionApiKey) throw new Error('Notion API Key not found');
  if (!notionDatabase) throw new Error('Notion Database ID not found');

  const client = instance(notionApiKey);

  if (github.context.eventName === 'push') {
    const pushPayload = github.context.payload as PushEvent;
    pushPayload.commits.forEach(commit => {
      const ref = pushPayload.ref.split('/');
      const header = `[${pushPayload.repository.full_name}:${
        ref[ref.length - 1]
      }]`;
      const message = `${header} ${commit.message} - ${commit.author.name}`;

      const code = commit.message.match(/#\w*/);
      if (!code || !code[0]) return;

      const issues = findIssue(client, code[0].replace('#', ''));
      issues.then(response => {
        if (!response.data) return;

        const pageId = response.data.results[0].id;
        const blocks = findIssueHistory(client, pageId);
        blocks.then(response => {
          if (!response.data) return;
          const results = response.data.results as Block[];
          const result = results.filter(result => result.type === 'toggle');
          if (!result) return;

          writeCommitHistory(client, result[0].id, message, commit.url);
        });
      });

      core.info(`commit is: ${code[0]} - ${message}`);
    });
  }
};

const findIssue = async (client: AxiosInstance, code: string) =>
  await client.post<Response>(`/v1/databases/${notionDatabase}/query`, {
    filter: {
      property: 'ISSUE_CODE',
      formula: {
        text: {
          equals: code,
        },
      },
    },
  });

const findIssueHistory = async (client: AxiosInstance, pageId: string) =>
  await client.get<Response>(`/v1/blocks/${pageId}/children`);

const writeCommitHistory = async (
  client: AxiosInstance,
  pageId: string,
  message: string,
  link: string
) =>
  await client.patch<Response>(`/v1/blocks/${pageId}/children`, {
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {content: message, link: {url: link}},
            },
          ],
        },
      },
    ],
  });

run()
  .then(() => {})
  .catch(err => {
    console.log('ERROR', err);
    core.setFailed(err.message);
  });
