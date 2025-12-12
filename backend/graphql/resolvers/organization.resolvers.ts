const requireAuth = (context: any) => {
  if (!context?.user) throw new Error('Unauthorized');
  return context.user;
};

// Mock organization data - in a real app, this would be in a database
let organizationData: any = {
  id: '1',
  name: 'My Organization',
  primaryColor: '#3B82F6',
  website: '',
  address: ''
};

export const organizationResolvers = {
  // Queries
  organization: async (_args: any, context: any) => {
    requireAuth(context);
    return organizationData;
  },

  // Mutations
  updateOrganization: async ({ name, primaryColor, website, address }: any, context: any) => {
    requireAuth(context);
    
    // Update organization data
    if (name !== undefined) organizationData.name = name;
    if (primaryColor !== undefined) organizationData.primaryColor = primaryColor;
    if (website !== undefined) organizationData.website = website;
    if (address !== undefined) organizationData.address = address;

    return organizationData;
  }
};
