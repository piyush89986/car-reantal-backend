// Seed script to add demo cars to the database
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carrentaldb';

// Car schema (matching the model)
const carSchema = new mongoose.Schema({
  name: String,
  brand: String,
  model: String,
  year: Number,
  color: String,
  fuelType: String,
  transmission: String,
  seatingCapacity: Number,
  mileage: Number,
  rentPerDay: Number,
  images: [String],
  isAvailable: Boolean,
  features: [String],
  description: String,
  addedBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

// Admin user ID
const adminUserId = new mongoose.Types.ObjectId('696be2a20017f4f9d50846b6');

// Demo car data
const demoCars = [
  {
    name: 'Honda City',
    brand: 'Honda',
    model: 'City ZX',
    year: 2024,
    color: 'Pearl White',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 17.8,
    rentPerDay: 2500,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Music System', 'Cruise Control'],
    description: 'Comfortable sedan perfect for city drives and long trips',
    addedBy: new mongoose.Types.ObjectId('696be2a20017f4f9d50846b6'),
    images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop']
  },
  {
    name: 'Maruti Swift',
    brand: 'Maruti Suzuki',
    model: 'Swift VXi',
    year: 2023,
    color: 'Fire Red',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    mileage: 22.5,
    rentPerDay: 1800,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Central Locking'],
    description: 'Fuel-efficient hatchback ideal for daily commuting',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop']
  },
  {
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    model: 'Creta SX',
    year: 2024,
    color: 'Phantom Black',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 18.5,
    rentPerDay: 3500,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Leather Seats', 'Touchscreen Infotainment', 'Parking Sensors'],
    description: 'Premium SUV with advanced features and spacious interiors',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop']
  },
  {
    name: 'Tata Nexon EV',
    brand: 'Tata',
    model: 'Nexon EV Max',
    year: 2024,
    color: 'Intensi-Teal',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 437,
    rentPerDay: 3000,
    isAvailable: true,
    features: ['Air Conditioning', 'Regenerative Braking', 'ABS', 'Airbags', 'Touchscreen Infotainment', 'Fast Charging', 'Connected Car Features'],
    description: 'Eco-friendly electric SUV with impressive range',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop']
  },
  {
    name: 'Toyota Innova Crysta',
    brand: 'Toyota',
    model: 'Innova Crysta VX',
    year: 2023,
    color: 'Silver Metallic',
    fuelType: 'Diesel',
    transmission: 'Manual',
    seatingCapacity: 7,
    mileage: 15.6,
    rentPerDay: 4000,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Captain Seats', 'Touchscreen', 'Reverse Camera'],
    description: 'Spacious MPV perfect for family trips and group travel',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format&fit=crop']
  },
  {
    name: 'Mahindra Thar',
    brand: 'Mahindra',
    model: 'Thar LX',
    year: 2024,
    color: 'Rocky Beige',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 4,
    mileage: 15.2,
    rentPerDay: 4500,
    isAvailable: true,
    features: ['Air Conditioning', '4x4 Drive', 'ABS', 'Airbags', 'Touchscreen Infotainment', 'Off-road Capable', 'Convertible Top'],
    description: 'Rugged off-roader for adventure enthusiasts',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop']
  },
  {
    name: 'Kia Seltos',
    brand: 'Kia',
    model: 'Seltos GTX',
    year: 2024,
    color: 'Glacier White Pearl',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 16.8,
    rentPerDay: 3200,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Ventilated Seats', 'Wireless Charging', '360 Camera'],
    description: 'Feature-packed compact SUV with premium feel',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop']
  },
  {
    name: 'BMW 3 Series',
    brand: 'BMW',
    model: '320d M Sport',
    year: 2023,
    color: 'Mineral White',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 20.4,
    rentPerDay: 8000,
    isAvailable: false,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'Leather Seats', 'iDrive System', 'Adaptive Cruise Control', 'Lane Assist'],
    description: 'Luxury sedan with exceptional performance and comfort',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format&fit=crop']
  },
  {
    name: 'Honda Amaze',
    brand: 'Honda',
    model: 'Amaze VX',
    year: 2023,
    color: 'Modern Steel',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    mileage: 18.3,
    rentPerDay: 1600,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Rear AC Vents'],
    description: 'Compact sedan with excellent fuel economy',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop']
  },
  {
    name: 'MG Hector',
    brand: 'MG',
    model: 'Hector Plus',
    year: 2024,
    color: 'Burgundy Red',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seatingCapacity: 7,
    mileage: 15.8,
    rentPerDay: 3800,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Panoramic Sunroof', 'AI Assistant', 'Wireless Charging', 'ADAS', '6-way Electric Seats'],
    description: 'Smart hybrid SUV with connected car technology',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop']
  },
  // 2-Seater Sports Cars
  {
    name: 'Porsche 911',
    brand: 'Porsche',
    model: '911 Carrera',
    year: 2024,
    color: 'Racing Yellow',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 2,
    mileage: 12.5,
    rentPerDay: 15000,
    isAvailable: true,
    features: ['Air Conditioning', 'Sport Seats', 'ABS', 'Airbags', 'Launch Control', 'Premium Sound System', 'Carbon Fiber Trim'],
    description: 'Iconic sports car with breathtaking performance and style',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop']
  },
  {
    name: 'Mazda MX-5',
    brand: 'Mazda',
    model: 'MX-5 Miata',
    year: 2023,
    color: 'Soul Red',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 2,
    mileage: 14.2,
    rentPerDay: 5500,
    isAvailable: true,
    features: ['Air Conditioning', 'Convertible Top', 'ABS', 'Airbags', 'Sport Suspension', 'Bose Sound System'],
    description: 'Fun-to-drive roadster perfect for weekend getaways',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop']
  },
  // 4-Seater Compact SUVs
  {
    name: 'Jeep Compass',
    brand: 'Jeep',
    model: 'Compass Limited',
    year: 2024,
    color: 'Granite Crystal',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 4,
    mileage: 16.3,
    rentPerDay: 3600,
    isAvailable: true,
    features: ['Air Conditioning', '4x4 Drive', 'ABS', 'Airbags', 'Touchscreen', 'Cruise Control', 'Keyless Entry'],
    description: 'Compact SUV with off-road capability and urban comfort',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop']
  },
  {
    name: 'Mini Cooper',
    brand: 'Mini',
    model: 'Cooper S',
    year: 2023,
    color: 'British Racing Green',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 4,
    mileage: 18.9,
    rentPerDay: 4200,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Panoramic Sunroof', 'LED Headlights', 'Sporty Seats'],
    description: 'Iconic compact car with go-kart handling and premium feel',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop']
  },
  // 5-Seater Sedans/Hatchbacks
  {
    name: 'Volkswagen Polo',
    brand: 'Volkswagen',
    model: 'Polo Highline',
    year: 2024,
    color: 'Candy White',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: 19.5,
    rentPerDay: 2200,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Touchscreen', 'Rear Parking Sensors', 'Cruise Control'],
    description: 'Premium hatchback with German engineering and comfort',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop']
  },
  {
    name: 'Ford EcoSport',
    brand: 'Ford',
    model: 'EcoSport Titanium',
    year: 2023,
    color: 'Lightning Blue',
    fuelType: 'Diesel',
    transmission: 'Manual',
    seatingCapacity: 5,
    mileage: 21.7,
    rentPerDay: 2400,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'SYNC Infotainment', 'Reverse Camera', 'Hill Assist'],
    description: 'Compact SUV with excellent features and fuel efficiency',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop']
  },
  // 7-Seater Family MPVs
  {
    name: 'Mahindra XUV700',
    brand: 'Mahindra',
    model: 'XUV700 AX7',
    year: 2024,
    color: 'Dazzling Silver',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 7,
    mileage: 16.5,
    rentPerDay: 4200,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'ADAS Level 2', 'Panoramic Sunroof', 'Sony 3D Sound', 'Wireless Charging', 'Sky Roof'],
    description: 'Feature-loaded 7-seater SUV with advanced safety technology',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800&auto=format&fit=crop']
  },
  {
    name: 'Kia Carens',
    brand: 'Kia',
    model: 'Carens Prestige',
    year: 2024,
    color: 'Imperial Blue',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 7,
    mileage: 16.2,
    rentPerDay: 3600,
    isAvailable: true,
    features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Ventilated Seats', 'Air Purifier', 'Drive Modes', 'Ambient Lighting', '10.25 inch Touchscreen'],
    description: 'Versatile 7-seater MPV perfect for family road trips',
    addedBy: adminUserId,
    images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop']
  }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cars (optional)
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Insert demo cars
    const result = await Car.insertMany(demoCars);
    console.log(`Successfully inserted ${result.length} demo cars`);

    // Display inserted cars
    result.forEach((car, index) => {
      console.log(`${index + 1}. ${car.name} - ${car.brand} ${car.model} (${car.year}) - ₹${car.rentPerDay}/day`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
