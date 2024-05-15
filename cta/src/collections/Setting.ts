import { CollectionConfig } from 'payload/types';

export const Setting: CollectionConfig = {
    slug: 'settings',
    labels: {
        singular: 'Setting',
        plural: 'Settings',
    },
    fields: [
        {
            name: 'StartTime',
            label: 'Start Date',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime', // This allows both date and time selection
                    displayFormat: 'yyyy-MM-dd HH:mm:ss', // Adjust the format as needed
                },
            },
        },
        {
            name: "ss",
            label: "ss",
            type: "text",
        },
        {
            name: "mm",
            label: "mm",
            type: "text",
        },
        {
            name: "hh",
            label: "hh",
            type: "text",
        },
        {
            name: 'network',
            label: 'Network',
            type: 'select',
            defaultValue: "testnet",
            options: [
                {
                    label: "Mainnet",
                    value: "mainnet"
                },
                {
                    label: "Testnet",
                    value: "testnet"
                }
            ]
        },
        {
            name: "mnemonics",
            label: "24 Phrase Owner",
            type: "text"
        },
        {
            name: "addresstoken",
            label: "Address Token",
            type: "text"
        },
        {
            name: "addressholder",
            label: "Address Holders Token",
            type: "text"
        }
    ],
    // hooks: {
    //     afterChange: [
    //         async ({ doc, operation }) => {
    //             if (operation === "update") {
    //                 await fetch("http://localhost:3000/transactions",{
    //                     method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(doc),
    //                 });
    //             }
    //             }
    //     ] 
    // }
};
