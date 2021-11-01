import {NotionObject} from './notion_object';

export interface Block extends NotionObject {
  type: string;
}
