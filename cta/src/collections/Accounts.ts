import { CollectionConfig } from 'payload/types';

export const Account: CollectionConfig = {
  slug: 'accounts',
  labels: {
    singular: 'Account',
    plural: 'Accounts',
  },
  fields: [
    {
      name: 'WalletAddress',
      label: 'Wallet Address',
      type: 'text',
    },
    {
      name: 'mnemonics',
      label: 'Mnemonics Account',
      type: 'text'
    },
    {
      name: 'awards',
      label: 'Awards',
      type: 'array',
      fields: [
        {
          name: 'awardId',
          label: 'Award ID',
          type: 'relationship',
          relationTo: 'awards',
          required: true
        },
        {
          name: 'create_at',
          label: 'Created At',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime', // This allows both date and time selection
              displayFormat: 'yyyy-MM-dd HH:mm:ss', // Adjust the format as needed
            },
          },
        },
        {
          name: 'claimed',
          label: 'Claimed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: '_id',
          label: 'Id',
          type: 'text'
        }
      ],
    },
  ],
};
