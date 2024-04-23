import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const supabaseKey = process.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 *
 * @param email
 * @param password
 * @example npx tsx scripts/insertUser.ts test@test.com password
 */
async function insertUser (email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: 'John',
          last_name: 'Doe',
        },
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