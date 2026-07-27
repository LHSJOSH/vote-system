export type AiOption = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  color: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type VoteRecord = {
  submissionId: string;
  nickname: string;
  optionId: string;
  optionName: string;
  reason: string;
  votedAtIso: string;
  votedAtKst: string;
  kstDate: string;
};

export type ResultItem = {
  option: AiOption;
  votes: number;
  percentage: number;
};

export type ResultsPayload = {
  date: string;
  totalVotes: number;
  results: ResultItem[];
  votes: VoteRecord[];
  updatedAt: string;
};
