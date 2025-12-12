export const auditLogTypes = `
  type AuditLog {
    _id: ID!
    vendorId: ID
    userId: ID
    action: String!
    targetModel: String
    targetId: ID
    details: JSON
    ipAddress: String
    timestamp: String!
  }

  scalar JSON

  input AuditLogFilterInput {
    vendorId: ID
    userId: ID
    action: String
    targetModel: String
    startDate: String
    endDate: String
  }
`;

export const auditLogQueries = `
  auditLogs(filter: AuditLogFilterInput, limit: Int, offset: Int): [AuditLog!]!
  auditLog(id: ID!): AuditLog
`;

export const auditLogMutations = `
  # Audit logs are created automatically, no manual mutations needed
`;
