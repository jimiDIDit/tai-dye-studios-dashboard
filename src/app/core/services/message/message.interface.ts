export declare type MessageType = 'new' | 'urgent' | 'private' | 'public' | 'archived' | 'read' | 'unread' | string;

export declare type GroupMember = { id: string, displayName: string, photoUrl: string };
export interface Message {
  [key: string]: any;
  id?: string;
  from?: string;
  to?: string | string[];
  title?: string;
  badge?: string;
  type?: MessageType | MessageType[]
  body?: string;
  attachments?: any[];
  timestamp?: any;
  read?: boolean;
  public?: boolean;
}

export interface MessageDisplaySettings {
  limitTo?: number;
  compact?: boolean;
  theme?: 'light' | 'dark' | 'system';
}
export interface MessageSettings {
  [key: string]: any;
  display?: MessageDisplaySettings;
  userId?: string;
  sendAsEmail?: boolean;
}

export const DEFAULT_SETTINGS: MessageSettings = {
  display: {
    limitTo: 10,
    compact: false,
    theme: 'light',
  },
  sendAsEmail: false,
}
