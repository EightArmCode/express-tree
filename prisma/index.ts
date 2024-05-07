import { PrismaClient } from '@prisma/client'
import Logger from '../server/logging/winstonLogger.ts'

const prisma = new PrismaClient()

export async function main() {
  try {
    return await prisma.leaf.findMany({
      where: { parentName: null },
      select: {
        name: true,
        parentName: true,
        description: true,
        children: {
          select: {
            name: true,
            parentName: true,
            description: true,
            children: {
              select: {
                name: true,
                parentName: true,
                description: true,
                children: {},
              },
            },
          },
        },
      },
    })
  } catch (e) {

    Logger.error(e)

  } finally {

    await prisma.$disconnect()
  }
}
