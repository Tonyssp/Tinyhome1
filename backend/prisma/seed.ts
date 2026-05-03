import { PrismaClient } from "@prisma/client";
import { toSlug } from "../src/utils/slug";

const prisma = new PrismaClient();

async function main() {
  const amenities = [
    "Wi-Fi",
    "Parking",
    "Air Conditioning",
    "Furnished",
    "Laundry",
    "Pet Friendly",
    "Security",
    "Balcony",
    "Kitchen",
    "Water Heater",
    "Garden",
    "Pool",
  ];

  await prisma.amenity.createMany({
    data: amenities.map((name) => ({
      name,
      slug: toSlug(name),
    })),
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
