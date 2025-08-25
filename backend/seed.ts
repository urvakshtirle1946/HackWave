import { seedData } from './src/seeders/dataSeeder';

console.log('🚀 Starting HackWave Data Seeder...');

seedData()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
