'use server'

export async function submitContact(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Form Data Received:', { name, email, message });

  // TODO: Connect to actual database here (e.g., using Prisma, Mongoose, or SQL query)
  // Example: await db.contact.create({ data: { name, email, message } });

  return { success: true, message: 'Message sent successfully!' };
}