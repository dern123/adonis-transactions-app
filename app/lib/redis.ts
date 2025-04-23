import { Redis } from 'ioredis'

// create client — local Redis
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  // password: 'optional-if-you-use-auth',
})

export default redis
