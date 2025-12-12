// Audit Log-related queries
export const GET_AUDIT_LOGS_QUERY = `
  query GetAuditLogs($filter: AuditLogFilterInput) {
    auditLogs(filter: $filter) {
      _id
      userId
      action
      targetModel
      targetId
      details
      ipAddress
      userAgent
      createdAt
    }
  }
`;

export const GET_AUDIT_LOG_QUERY = `
  query GetAuditLog($id: ID!) {
    auditLog(id: $id) {
      _id
      userId
      action
      targetModel
      targetId
      details
      ipAddress
      userAgent
      createdAt
    }
  }
`;
