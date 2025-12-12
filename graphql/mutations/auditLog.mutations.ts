// Audit Log-related mutations
export const CREATE_AUDIT_LOG_MUTATION = `
  mutation CreateAuditLog($input: AuditLogInput!) {
    createAuditLog(input: $input) {
      _id
      userId
      action
      targetModel
      targetId
      details
      createdAt
    }
  }
`;
