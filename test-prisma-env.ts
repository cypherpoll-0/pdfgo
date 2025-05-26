import { PrismaClient } from '@prisma/client';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
