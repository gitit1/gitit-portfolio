// Types for the "How I Build" content feed — a build-time JSON import that
// mirrors the shape the architect's exporter produces. The sample data in
// how-i-build.json matches this contract exactly; the real exporter will
// swap in live data under the same schema.

import feed from './how-i-build.json';

export type EraKey = 'hands-on' | 'ai-assisted' | 'ai-manager';

export type EraStats = {
  sessions: number;
  genuineMessages: number;
  outputTokens: number;
  from: string;
  to: string;
};

export type Era = {
  key: EraKey;
  labelHe: string;
  labelEn: string;
  years: string;
  stats: EraStats | null;
};

export type Totals = {
  sessions: number;
  genuineMessages: number;
  outputTokens: number;
  from: string;
  to: string;
};

export type QuoteSpeaker = 'user' | 'assistant';

export type Quote = {
  speaker: QuoteSpeaker;
  he: string;
  en: string;
};

export type StoryType = 'numbers' | 'evolution' | 'architecture-convo' | string;

export type Story = {
  slug: string;
  type: StoryType;
  typeLabelHe: string;
  typeLabelEn: string;
  order: number;
  projectSlug: string | null;
  status: 'draft' | 'approved';
  titleHe: string;
  titleEn: string;
  narrativeHe: string;
  narrativeEn: string;
  quotes: Quote[];
};

export type JournalEntry = {
  slug: string;
  projectSlug: string | null;
  from: string;
  to: string;
  titleHe: string;
  titleEn: string;
  bodyHe: string;
  bodyEn: string;
  status: 'draft' | 'approved';
};

export type FeedMode = 'approved' | 'preview';

export type HowIBuildFeed = {
  generatedAt: string;
  mode: FeedMode;
  totals: Totals;
  eras: Era[];
  stories: Story[];
  journal: JournalEntry[];
};

export const howIBuildFeed = feed as HowIBuildFeed;
