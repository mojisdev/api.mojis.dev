export const DRAFT_PARAMETER = {
  in: "query" as const,
  name: "draft",
  required: false,
  description: "Whether to include draft versions",
  schema: {
    type: "string" as const,
    enum: ["true", "false"],
  },
};

export const BRANCH_PARAMETER = {
  in: "query" as const,
  name: "branch",
  required: false,
  description: "Which GitHub branch to use",
  schema: {
    type: "string" as const,
  },
};
