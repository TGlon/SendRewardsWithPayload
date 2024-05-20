import { CollectionConfig } from 'payload/types';
import moment from 'moment-timezone';
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
            name: 'settime',
            label: 'Set Time',
            type: 'number',
            defaultValue: 24
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
    //     beforeChange: [
    //         async ({ data }) => {
    //             if (data.StartTime) {
    //                 // Convert StartTime from UTC to +7 timezone
    //                 const convertedTime = moment.tz(data.StartTime, 'UTC').tz('Asia/Bangkok').format();
    //                 data.StartTime = convertedTime;
    //             }
    //         }
    //     ],
    //     // afterChange: [
    //     //     async ({ doc, operation }) => {
    //     //         if (operation === "update") {
    //     //             await fetch("http://localhost:3000/transactions",{
    //     //                 method: "PUT",
    //     //         headers: {
    //     //           "Content-Type": "application/json",
    //     //         },
    //     //         body: JSON.stringify(doc),
    //     //             });
    //     //         }
    //     //         }
    //     // ] 
    // }
};
