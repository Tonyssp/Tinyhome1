import { PrismaClient } from "@prisma/client";
import { defaultAmenities } from "../src/modules/listing/default-amenities";

const prisma = new PrismaClient();

async function main() {
  await prisma.amenity.createMany({
    data: defaultAmenities,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
