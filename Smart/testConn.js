const mongoose = require('mongoose');

async function test() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(2);
  }

  console.log('Attempting mongoose.connect to:', uri.replace(/:(.*)@/, ':*****@'));

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connection successful. readyState=', mongoose.connection.readyState);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error(err);
    process.exit(1);
  }
}

test();
