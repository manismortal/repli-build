import "dotenv/config";
import { db } from "../server/db";
import { packages } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedPackages() {
  console.log("Seeding packages...");

  const PACKAGES = [
    {
      name: "Standard Package",
      price: "250",
      dailyReward: "100", // (250 * 12) / 30
      description: "Standard Package - 30 Days"
    },
    {
      name: "Classic Package",
      price: "500",
      dailyReward: "200", // (500 * 12) / 30
      description: "Classic Package - 30 Days"
    },
    {
      name: "Silver Package",
      price: "1500",
      dailyReward: "600", // (1500 * 12) / 30
      description: "Silver Package - 30 Days"
    },
    {
      name: "Gold Package",
      price: "2000",
      dailyReward: "800", // (2000 * 12) / 30
      description: "Gold Package - 30 Days"
    },
    {
      name: "Platinum Maersk",
      price: "5000",
      dailyReward: "2000", // (5000 * 12) / 30
      description: "Platinum Maersk - 30 Days"
    },
  ];

  // Optional: Clear existing packages to avoid duplicates or stale data
  // await db.delete(packages); 

  for (const pkg of PACKAGES) {
    // Check if exists by name to update or insert
    const existing = await db.select().from(packages).where(eq(packages.name, pkg.name));
    
    if (existing.length > 0) {
        console.log(`Updating ${pkg.name}...`);
        await db.update(packages)
            .set({ 
                price: pkg.price, 
                dailyReward: pkg.dailyReward,
                description: pkg.description 
            })
            .where(eq(packages.id, existing[0].id));
    } else {
        console.log(`Creating ${pkg.name}...`);
        await db.insert(packages).values(pkg);
    }
  }

  console.log("Package seeding complete.");
  process.exit(0);
}

seedPackages().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
