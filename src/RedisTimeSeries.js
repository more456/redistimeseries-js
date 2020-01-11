const Redis = require('redis');
const Query = require('./Query');
const commands = require('./commands');


class RedisTimeSeries {
  /**
   * Create a new RedisTimeSeries client, the {options} object is the same as for the redis library
   */
  constructor(options = {}) {
    this.options = options;
    this.client = null;
    this._load(commands);
  }


  /**
   * Connect client to redis server
   */
  async connect() {
    this.client = await Redis.createClient(this.options);
  }

  /**
   * Fetch redis client
   */
  getClient() {
    return this.client;
  }

  /**
   * Set redis client
   */
  setClient(client = null) {
    if (!client) {
      throw new Error('Client must be a valid object');
    }

    this.client = client;
  }

  /**
   * Send plain command to redis
   */
  async send(...params) {
    const [command, ...args] = params;
    return new Promise((resolve, reject) => {
      this.client.send_command(command, args, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }


  _load(querySchemas) {
    Object.values(querySchemas).forEach((querySchema) => {
      if (querySchema.isExecutable()) {
        this[querySchema.getMethodName()] = (...params) => {
          return Query.create(querySchema).params(params)
        };
      }
    });
  }


  // /**
  //  * TS.CREATE key [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
  //  */
  // async create(key, { retention, labels = {}, uncompressed } = {}) {
  //   Validator.checkKey(key);

  //   const query = Query
  //     .create(commands.TS_CREATE)
  //     .addParams(key)
  //     .retention(retention)
  //     .labels(labels)
  //     .uncompressed(uncompressed)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.ALTER key [RETENTION retentionTime] [LABELS field value..]
  //  */
  // async alter(key, { retention, labels = {} } = {}) {
  //   Validator.checkKey(key);

  //   const query = Query
  //     .create(commands.TS_ALTER)
  //     .addParams(key)
  //     .retention(retention)
  //     .labels(labels)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.ADD key timestamp value [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
  //  */
  // async add(key, timestamp, value, { retention, labels = {}, uncompressed } = {}) {
  //   Validator.checkKey(key);
  //   Validator.checkTimestamp(timestamp);
  //   Validator.checkValue(value);

  //   const query = Query
  //     .create(commands.TS_ADD)
  //     .addParams(key, timestamp, value)
  //     .retention(retention)
  //     .labels(labels)
  //     .uncompressed(uncompressed)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.MADD key timestamp value [key timestamp value ...]
  //  */
  // async madd(...arrayOfObjects) {
  //   Validator.checkParams(arrayOfObjects);

  //   const params = [];

  //   arrayOfObjects.reduce((acc, { key, timestamp, value }) => {
  //     Validator.checkKey(key);
  //     Validator.checkTimestamp(timestamp);
  //     Validator.checkValue(value);

  //     acc.push(key);
  //     acc.push(timestamp);
  //     acc.push(value);
  //     return acc;
  //   }, params);

  //   const query = Query
  //     .create(commands.TS_MADD)
  //     .addParams(...params)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.INCRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
  //  */
  // async incrBy(key, value, { timestamp, retention, labels = {}, uncompressed } = {}) {
  //   Validator.checkKey(key);
  //   Validator.checkValue(value);

  //   const query = Query
  //     .create(commands.TS_INCRBY)
  //     .addParams(key, value)
  //     .timestamp(timestamp)
  //     .retention(retention)
  //     .labels(labels)
  //     .uncompressed(uncompressed)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.DECRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
  //  */
  // async decrBy(key, value, { timestamp, retention, labels = {}, uncompressed } = {}) {
  //   Validator.checkKey(key);
  //   Validator.checkValue(value);

  //   const query = Query
  //     .create(commands.TS_DECRBY)
  //     .addParams(key, value)
  //     .timestamp(timestamp)
  //     .retention(retention)
  //     .labels(labels)
  //     .uncompressed(uncompressed)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.CREATERULE sourceKey destKey AGGREGATION aggregationType timeBucket
  //  */
  // async createRule(sourceKey, destKey, aggregation = {}) {
  //   Validator.checkKey(sourceKey, 'sourceKey');
  //   Validator.checkKey(destKey, 'destKey');

  //   const query = Query
  //     .create(commands.TS_CREATERULE)
  //     .addParams(sourceKey, destKey)
  //     .aggregation(aggregation)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.DELETERULE sourceKey destKey
  //  */
  // async deleteRule(sourceKey, destKey) {
  //   Validator.checkKey(sourceKey, 'sourceKey');
  //   Validator.checkKey(destKey, 'destKey');

  //   const query = Query
  //     .create(commands.TS_DELETERULE)
  //     .addParams(sourceKey, destKey)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.RANGE key fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket]
  //  */

  // async range(key, fromTimestamp, toTimestamp, { count, aggregation } = {}) {
  //   Validator.checkKey(key);
  //   Validator.checkTimestampRange(fromTimestamp, toTimestamp);

  //   const query = Query
  //     .create(commands.TS_RANGE)
  //     .addParams(key, fromTimestamp, toTimestamp)
  //     .count(count)
  //     .aggregation(aggregation)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.MRANGE fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket] [WITHLABELS] FILTER filter..
  //  */
  // async mrange(fromTimestamp, toTimestamp, filter = [], { count, aggregation, withLabels } = {}) {
  //   Validator.checkTimestampRange(fromTimestamp, toTimestamp);
  //   Validator.checkFilter(filter);

  //   const query = Query
  //     .create(commands.TS_MRANGE)
  //     .addParams(fromTimestamp, toTimestamp)
  //     .count(count)
  //     .aggregation(aggregation)
  //     .withLabels(withLabels)
  //     .filter(filter)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.GET key
  //  */
  // async get(key) {
  //   Validator.checkKey(key);

  //   const query = Query
  //     .create(commands.TS_GET)
  //     .addParams(key)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.MGET FILTER filter...
  //  */
  // async mget(...filter) {
  //   Validator.checkFilter(filter);

  //   const query = Query
  //     .create(commands.TS_MGET)
  //     .filter(filter)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.INFO key
  //  */
  // async info(key) {
  //   Validator.checkKey(key);

  //   const query = Query
  //     .create(commands.TS_INFO)
  //     .addParams(key)
  //     .build();

  //   return this.send(...query);
  // }


  // /**
  //  * TS.QUERYINDEX filter...
  //  */
  // async queryIndex(...filter) {
  //   Validator.checkFilter(filter);

  //   const query = Query
  //     .create(commands.TS_QUERYINDEX)
  //     .pureFilter(filter)
  //     .build();

  //   return this.send(...query);
  // }
}

module.exports = RedisTimeSeries;
