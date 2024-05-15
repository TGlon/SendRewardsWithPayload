import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import { Transaction } from './collections/Transactions'
import { Award } from './collections/Awards'
import { Account } from './collections/Accounts'
import { Setting } from './collections/Setting'
import { Currency } from './collections/Currency'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    // autoLogin: {
    //   email: 'ttlong315@gmail.com',
    //   password: '20022001',
    //   prefillOnly: true,
    // },
  },
  editor: slateEditor({}),
  collections: [Users, Transaction, Award, Account, Setting, Currency],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
    connectOptions: {
      dbName: "cta"
    }
  }),
})
