import { CollectionConfig } from 'payload/types';

export const Network: CollectionConfig = {
    slug: 'networks',
    labels: {
        singular: 'Network',
        plural: 'Networks',
    },
    fields: [
        {
            name: 'network',
            label: 'Network',
            type: 'select',
            options: [
                {
                    label: "Mainnet",
                    value: ""
                }
            ]
        }
    ],
};
