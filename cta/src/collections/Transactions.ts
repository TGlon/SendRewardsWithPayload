import { CollectionConfig } from 'payload/types';

export const Transaction: CollectionConfig = {
  slug: 'transactions',
  labels: {
    singular: 'Transaction',
    plural: 'Transactions',
  },
  fields: [
    {
      name: 'hash',
      label: 'Hash',
      type: 'text',
    },
    {
      name: 'lt',
      label: 'Logical Time',
      type: 'text',
    },
    {
      name: 'account',
      label: 'Account',
      type: 'group',
      fields: [
        {
          name: 'address',
          label: 'Address',
          type: 'text',
        },
        {
          name: 'is_scam',
          label: 'Is Scam?',
          type: 'checkbox',
        },
        {
          name: 'is_wallet',
          label: 'Is Wallet?',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'utime',
      label: 'Unix Time',
      type: 'text',
    },
    {
      name: 'total_fees',
      label: 'Total Fees',
      type: 'text',
    },
    {
      name: 'transaction_type',
      label: 'Transaction Type',
      type: 'text',
    },
    {
      name: 'in_msg',
      label: 'Incoming Message',
      type: 'group',
      fields: [
        {
          name: 'msg_type',
          label: 'Message Type',
          type: 'text',
        },
        {
          name: 'created_lt',
          label: 'Created Logical Time',
          type: 'text',
        },
        {
          name: 'ihr_disabled',
          label: 'IHR Disabled',
          type: 'checkbox',
        },
        {
          name: 'bounce',
          label: 'Bounce',
          type: 'checkbox',
        },
        {
          name: 'bounced',
          label: 'Bounced',
          type: 'checkbox',
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
        },
        {
          name: 'fwd_fee',
          label: 'Forward Fee',
          type: 'text',
        },
        {
          name: 'ihr_fee',
          label: 'IHR Fee',
          type: 'text',
        },
        {
          name: 'destination',
          label: 'Destination',
          type: 'group',
          fields: [
            {
              name: 'address',
              label: 'Address',
              type: 'text',
            },
            {
              name: 'is_scam',
              label: 'Is Scam?',
              type: 'checkbox',
            },
            {
              name: 'is_wallet',
              label: 'Is Wallet?',
              type: 'checkbox',
            },
          ],
        },
        {
          name: 'source',
          label: 'Source',
          type: 'group',
          fields: [
            {
              name: 'address',
              label: 'Address',
              type: 'text',
            },
            {
              name: 'is_scam',
              label: 'Is Scam?',
              type: 'checkbox',
            },
            {
              name: 'is_wallet',
              label: 'Is Wallet?',
              type: 'checkbox',
            },
          ],
        },
        {
          name: 'import_fee',
          label: 'Import Fee',
          type: 'text',
        },
        {
          name: 'created_at',
          label: 'Created At',
          type: 'text',
        },
      ],
    },
    {
      name: 'block',
      label: 'Block',
      type: 'text',
    },
    {
      name: 'credit_phase',
      label: 'Credit Phase',
      type: 'group',
      fields: [
        {
          name: 'fees_collected',
          label: 'Fees Collected',
          type: 'text',
        },
        {
          name: 'credit',
          label: 'Credit',
          type: 'text',
        },
      ],
    },
    {
      name: 'out_msgs',
      label: 'Outgoing Messages',
      type: 'array',
      fields: [
        {
          name: 'msg_type',
          label: 'Message Type',
          type: 'text',
        },
        {
          name: 'created_lt',
          label: 'Created Logical Time',
          type: 'text',
        },
        {
          name: 'ihr_disabled',
          label: 'IHR Disabled',
          type: 'checkbox',
        },
        {
          name: 'bounce',
          label: 'Bounce',
          type: 'checkbox',
        },
        {
          name: 'bounced',
          label: 'Bounced',
          type: 'checkbox',
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
        },
        {
          name: 'fwd_fee',
          label: 'Forward Fee',
          type: 'text',
        },
        {
          name: 'ihr_fee',
          label: 'IHR Fee',
          type: 'text',
        },
        {
          name: 'destination',
          label: 'Destination',
          type: 'group',
          fields: [
            {
              name: 'address',
              label: 'Address',
              type: 'text',
            },
            {
              name: 'is_scam',
              label: 'Is Scam?',
              type: 'checkbox',
            },
            {
              name: 'is_wallet',
              label: 'Is Wallet?',
              type: 'checkbox',
            },
          ],
        },
        {
          name: 'source',
          label: 'Source',
          type: 'group',
          fields: [
            {
              name: 'address',
              label: 'Address',
              type: 'text',
            },
            {
              name: 'is_scam',
              label: 'Is Scam?',
              type: 'checkbox',
            },
            {
              name: 'is_wallet',
              label: 'Is Wallet?',
              type: 'checkbox',
            },
          ],
        },
        {
          name: 'import_fee',
          label: 'Import Fee',
          type: 'text',
        },
        {
          name: 'created_at',
          label: 'Created At',
          type: 'text',
        },
      ],
    },
  ],
};
