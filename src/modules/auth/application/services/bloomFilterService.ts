import {Injectable, OnModuleInit} from '@nestjs/common'
import {BloomFilter} from 'bloom-filters'
import Redis from 'ioredis'

@Injectable()
export class BloomFilterService implements OnModuleInit {
  private redis: Redis
  private bloomFilter: BloomFilter

  async onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    })

    // Try to load existing bloom data from Redis
    const bloomData = await this.redis.get('bloom:usernames')
    if (bloomData) {
      const json = JSON.parse(bloomData)
      this.bloomFilter = BloomFilter.fromJSON(json)
    } else {
      // expectedItems = estimated total users, falsePositiveRate = 1%
      this.bloomFilter = BloomFilter.create(10000, 0.01)
    }
  }

  async add(username: string) {
    this.bloomFilter.add(username)
    await this.saveToRedis()
  }

  async mightContain(username: string): Promise<boolean> {
    return this.bloomFilter.has(username)
  }

  private async saveToRedis() {
    const serialized = JSON.stringify(this.bloomFilter.saveAsJSON())
    await this.redis.set('bloom:usernames', serialized)
  }
}
