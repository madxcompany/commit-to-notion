import {NotionObject} from './notion_object';

export interface Response {
  object: string;
  results: NotionObject[];
}
