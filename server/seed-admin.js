require('dotenv').config();
const { supabase } = require('./db');

const email = process.argv[2] || 'admin@elizion.com';
const password = process.argv[3] || 'ELIZION_SEC_F97BA2';

async function seedAdmin() {
  console.log(`Starting admin user seeding...`);
  console.log(`Target Email: ${email}`);
  console.log(`Target Password: ${password}`);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // bypass email confirmation flow
    });

    if (error) {
      if (error.message.includes('already exists') || error.status === 422) {
        console.log(`\nSuccess: An admin user with email "${email}" already exists in Supabase Auth.`);
      } else {
        throw error;
      }
    } else {
      console.log(`\nSuccess: Admin user created successfully!`);
      console.log(`User ID: ${data.user.id}`);
    }
  } catch (err) {
    console.error(`\nError creating admin user:`, err.message || err);
    process.exit(1);
  }
}

seedAdmin();
