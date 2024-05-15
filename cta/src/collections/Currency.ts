import { CollectionConfig } from 'payload/types';

export const Currency: CollectionConfig = {
  slug: 'currency',
  labels: {
    singular: 'Currency',
    plural: 'Currencies',
  },
  admin: {
    useAsTitle: 'TON'
  },
  fields: [
    {
        name: 'VND',
        label: 'VNĐ',
        type: 'text'
    },
    {
        name: 'TON',
        label: 'TON',
        type: 'text',  
    },
    {
      name: 'USD',
      label: 'USD',
      type: 'text'
    }
  ],
};
