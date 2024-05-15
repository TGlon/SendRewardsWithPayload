import { CollectionConfig } from 'payload/types';

export const Award: CollectionConfig = {
  slug: 'awards',
  labels: {
    singular: 'Award',
    plural: 'Awards',
  },
  fields: [
    {
      name: 'totalFee',
      label: 'Total Fee',
      type: 'text',  
    },
    {
      name: 'awardFee',
      label: 'Award Fee (AL Token)',
      type: 'number',
    },
    {
      name: 'receivingFee',
      label: 'Receiving Fee',
      type: 'relationship',
      relationTo: 'currency',
    }
  ],
};
