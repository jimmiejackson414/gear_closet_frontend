import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 *
 * @description Programmatically insert a user into the Supabase database
 * @param email
 * @param password
 * @example npx tsx scripts/insertUser.ts test@test.com password
 */
async function insertUser (email: string, password: string) {
  if (!email || !password) {
    console.error('Please provide an email and password');
    return;
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      password,
      user_metadata: {
        first_name: 'John',
        last_name: 'Doe',
      },
    });
    if (error || !data?.user) {
      console.error(`Error signing up user: ${JSON.stringify(error)}`);
      return;
    }
    console.log('***** User successfully inserted!');
    console.table(data.user);
  } catch (err) {
    console.log(`Error inserting user: ${JSON.stringify(err)}`);
  }
}

const email = process.argv[2];
const password = process.argv[3];

insertUser(email, password);