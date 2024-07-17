import { readFileSync } from 'fs'
import { createServer } from 'http'
import { join } from 'path'
import { parse } from 'graphql'
import { createYoga } from 'graphql-yoga'
import { buildSubgraphSchema } from '@apollo/subgraph'

const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
]

createServer(
  createYoga({
    schema: buildSubgraphSchema({
      typeDefs: parse(readFileSync(join(__dirname, 'typeDefs.graphql'), 'utf-8')),
      resolvers: {
        Query: {
          users: () => users,
        },
        User: {
          __resolveReference: (user) => {
            return users.find((e) => e.id === user.id)
          },
        },
      },
    }),
  }),
).listen(4001, () => {
  console.log('Users subgraph is running on http://localhost:4001')
})
