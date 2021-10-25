import axios from 'axios';

export const instance = (token: string) =>
  axios.create({
    baseURL: 'https://api.notion.com/',
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2021-08-16',
    },
  });
