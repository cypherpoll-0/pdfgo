import 'dotenv/config' 
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  })

  console.log(`Seeded user: ${user.email}`)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
