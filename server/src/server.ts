import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query']
})

async function bootstrap(){
  const fastify = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: 'SYS:yyyy-mm-dd hh:mm:ss Z',
          ignore: 'pid,hostname',
        }
      }
    }
  })

  await fastify.register(cors, {
    origin: true
  })

  fastify.get('/pools/count', async () => {
    const pools = await prisma.pool.count({ 
      where: { 
        code: {
          startsWith: 'P'
        }
      }
    })
    return { count: pools }
  })

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()