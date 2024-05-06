import { Leaf, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function main() {
  let tree: Leaf[]|undefined = []
  try {
    tree = await prisma.leaf.findMany({
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
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }

  return tree
}
