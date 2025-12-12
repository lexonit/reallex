export const UPDATE_TEMPLATE_MUTATION = `
  mutation UpdateTemplate($id: ID!, $name: String, $subject: String, $body: String) {
    updateEmailTemplate(id: $id, name: $name, subject: $subject, body: $body) {
      id
      name
      subject
      body
    }
  }
`;

export const CREATE_TEMPLATE_MUTATION = `
  mutation CreateTemplate($name: String!, $subject: String!, $body: String!) {
    createEmailTemplate(name: $name, subject: $subject, body: $body) {
      id
      name
      subject
      body
    }
  }
`;

export const DELETE_TEMPLATE_MUTATION = `
  mutation DeleteTemplate($id: ID!) {
    deleteEmailTemplate(id: $id) {
      id
    }
  }
`;
