// This file untuk testing!!!

const { db } = require('../src/database/drizzle');
const { users, categories, rooms } = require('../src/models/schema');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('🌱 Inserting initial data to Neon database...');

  try {
    // Insert Categories (required for the app to function)
    console.log('📂 Inserting categories...');
    const insertedCategories = await db.insert(categories).values([
      { name: 'Sports', description: 'Physical activities and sports' },
      { name: 'Gaming', description: 'Video games and e-sports' },
      { name: 'Education', description: 'Study groups and learning' },
      { name: 'Social', description: 'Hangouts and meeting new people' },
      { name: 'Music', description: 'Jamming and music lovers' },
      { name: 'Hobbies', description: 'Various hobbies and interests' },
    ]).onConflictDoNothing().returning();

    // 2. Create a Test User (To test the ranking logic)
    console.log('👤 Inserting test user (Wahib)...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [user] = await db.insert(users).values({
      name: 'Wahib Test',
      email: 'test@syncspace.com',
      password: hashedPassword,
      domicile: 'Depok',
      hobbies: ['Gaming', 'Education'],
    }).onConflictDoNothing().returning();

    if (user && insertedCategories.length > 0) {
      const gamingCat = insertedCategories.find(c => c.name === 'Gaming');
      const socialCat = insertedCategories.find(c => c.name === 'Social');

      // 3. Insert Test Rooms
      console.log('🏠 Inserting test rooms to verify ranking...');
      await db.insert(rooms).values([
        {
          masterId: user.id,
          categoryId: gamingCat.id,
          title: 'Gaming Session (Matches Hobby)',
          region: 'Depok',
          maxCapacity: 5,
          status: 'OPEN',
        },
        {
          masterId: user.id,
          categoryId: socialCat.id,
          title: 'Coffee Hangout (General)',
          region: 'Depok',
          maxCapacity: 10,
          status: 'OPEN',
        }
      ]).onConflictDoNothing();
    }

    console.log('✅ Success! Data is now in your Neon Database.');
    console.log('💡 You can now delete this /temp folder.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seed();
