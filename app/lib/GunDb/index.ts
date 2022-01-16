import Gun from 'gun';
import { GunCtx } from './GunCtx';

const host = process.env.DOMAIN || '0.0.0.0';
const ports = {
  RELAY: process.env.GUN_PORT || 5150,
  CLIENT: process.env.CLIENT_PORT || 3333,
};
export const gun = Gun({
  peers: [`http://${host}:${ports.RELAY}/gun`],
});

export const {
  createUser,
  login,
  putVal,
  getVal,
  signAction,
  resetPassword,
  setArray,
  MapArray,
} = GunCtx();

export type UserData = {
  profile: UserProfile;
  info: UserInfo;
};

export interface UserProfile {
  alias: string;
  socials: Socials;
}

export type UserInfo = {
  createdAt: string;
  lastLogin: string;
  viewed: string[];
  bookmarked: string[];
};

export type Socials = {
  facebook: SocialData;
  twitter: SocialData;
  linkedIn: SocialData;
  github: SocialData;
  [key: string]: SocialData;
};

export type SocialData = {
  brand: string;
  url: string;
  color?: string;
};

export type Category =
  | 'concepts'
  | 'tutorials'
  | 'packages'
  | 'templates'
  | 'examples'
  | 'others';

export interface Page {
  url: string;
  site?: string;
  author?: string;
  category?: Category;
  title?: string;
  description?: string;
  dependencies?: Record<string, string>;
  image?: string;
  video?: string;
}

export type SubmissionStatus = 'PUBLISHED' | 'RESUBMITTED' | 'INVALID_CATEGORY';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface Metadata
  extends Pick<
    Entry,
    | 'id'
    | 'url'
    | 'category'
    | 'author'
    | 'title'
    | 'description'
    | 'viewCounts'
    | 'bookmarkCounts'
    | 'createdAt'
  > {
  integrations: string[];
}

export interface Entry extends Page {
  id: string;
  viewCounts?: number;
  bookmarkCounts?: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SearchOptions {
  keyword?: string;
  list?: 'bookmarks' | 'history' | null;
  author?: string | null;
  hostname?: string | null;
  categories?: Category[] | null;
  integrations?: string[] | null;
  excludes?: string[] | null;
  limit?: number;
  sortBy?: 'hotness' | null;
}
