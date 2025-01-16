import connectDb from "@/db/mongoose";
export async function GET(req) {
  try {
    await connectDb(); // Connect to the database
    console.log('Database connection successful!');
    return new Response('Database connected successfully!', { status: 200 });
  } catch (error) {
    console.error('Database connection failed:', error);
    return new Response('Database connection failed', { status: 500 });
  }
}
