const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const keys = require('../config/keys')

const client = redis.createClient(keys.redis_url)
client.get = util.promisify(client.get)
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = async function () {
  const query = this.getQuery()
  const collection = this.mongooseCollection.name
  const key = JSON.stringify(
    Object.assign({}, query, { collection: collection }) // Corrected 'colletcion' typo to 'collection'
  )

  // See if we have a value for key in Redis, if yes return that. Otherwise send it over to MongoDB and save it to Redis
  const cacheValue = await client.get(key)
  if (cacheValue) {
    const doc = new this.model(JSON.parse(cacheValue))
    console.log('Cache hit:', doc)
    return JSON.parse(doc)
  }

  // If cache value doesn't exist, execute the original Mongoose query
  const result = await exec.apply(this, arguments)

  // Save the result to Redis cache
  client.set(key, JSON.stringify(result))

  // Return the result
  return result
}
