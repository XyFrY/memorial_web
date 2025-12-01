const dotenv = require('dotenv');
dotenv.config();

const { connectMongo } = require('../db/mongo');
const Memorial = require('../models/memorial');
const User = require('../models/user');

// Sample data arrays
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Portland', 'Nashville', 'Miami', 'Atlanta', 'Detroit'];

const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const biographies = [
    "A beloved {relation} who touched the lives of everyone they met. Known for their kindness, generosity, and infectious laugh. They spent their life dedicated to family and community service.",
    "{name} was a passionate educator who inspired countless students throughout their career. They believed in the power of knowledge and the importance of lifelong learning.",
    "An avid outdoors enthusiast, {name} found peace in nature and shared that love with friends and family. They were known for their adventurous spirit and warm heart.",
    "{name} dedicated their life to helping others through their work in healthcare. Their compassion and dedication made a lasting impact on their patients and colleagues.",
    "A talented artist whose creativity knew no bounds. {name} expressed themselves through painting, music, and writing, leaving behind a beautiful legacy of art.",
    "{name} was a decorated veteran who served their country with honor and distinction. After their service, they continued to give back to the community in countless ways.",
    "Known for their culinary skills and love of bringing people together, {name} hosted countless gatherings where friends and family created lasting memories.",
    "A brilliant entrepreneur who built a successful business from the ground up. {name} was known for their innovative thinking and generous mentorship of young professionals.",
    "{name} devoted their life to environmental conservation and protecting wildlife. Their passion for nature inspired others to care for our planet.",
    "A cherished {relation} whose wisdom and guidance shaped the lives of many. {name} had a gift for listening and always knew the right words to say.",
    "An accomplished athlete who competed at the highest levels while maintaining humility and grace. {name} inspired young athletes to pursue their dreams.",
    "A dedicated public servant who worked tirelessly to improve their community. {name}'s legacy of service continues to impact lives today.",
    "{name} was a master craftsperson whose attention to detail and dedication to their trade was admired by all. They took great pride in teaching others their skills.",
    "Known for their quick wit and storytelling abilities, {name} could light up any room. They had an incredible memory and loved sharing tales from their rich life.",
    "A devoted {relation} who put family first in everything they did. {name} created a warm, loving home filled with laughter and cherished traditions.",
    "{name} was a pioneer in their field, breaking barriers and opening doors for those who followed. Their courage and determination changed many lives.",
    "An enthusiastic volunteer who gave countless hours to charitable causes. {name} believed strongly in giving back and making the world a better place.",
    "A talented musician whose performances brought joy to audiences for decades. {name}'s love of music was infectious and inspired many to pursue their own musical journeys.",
    "{name} had an incredible green thumb and cultivated beautiful gardens that were the envy of the neighborhood. They freely shared plants, knowledge, and their love of gardening.",
    "A beloved coach and mentor who saw potential in every young person. {name} taught valuable life lessons through sports and their genuine care for others."
];

const relations = ['parent', 'grandparent', 'friend', 'mentor', 'sibling', 'partner', 'colleague'];

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMemorial() {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const fullName = `${firstName} ${lastName}`;

    // Generate birth date between 1920 and 1970
    const birthDate = randomDate(new Date(1920, 0, 1), new Date(1970, 11, 31));

    // Generate death date between 2015 and 2024
    const deathDate = randomDate(new Date(2015, 0, 1), new Date(2024, 11, 31));

    // Ensure death date is after birth date
    if (deathDate < birthDate) {
        deathDate.setFullYear(birthDate.getFullYear() + 50 + Math.floor(Math.random() * 30));
    }

    const birthCity = randomElement(cities);
    const birthState = randomElement(states);
    const deathCity = randomElement(cities);
    const deathState = randomElement(states);

    const biographyTemplate = randomElement(biographies);
    const relation = randomElement(relations);
    const biography = biographyTemplate
        .replace('{name}', firstName)
        .replace('{relation}', relation);

    return {
        name: {
            first: firstName,
            last: lastName
        },
        birthDate: birthDate,
        deathDate: deathDate,
        biography: biography,
        birthLocation: {
            city: birthCity,
            state: birthState
        },
        deathLocation: {
            city: deathCity,
            state: deathState
        },
        approved: true, // Auto-approve test data
        publishedAt: new Date()
    };
}

async function generateTestData() {
    try {
        console.log('Connecting to MongoDB...');
        await connectMongo();
        console.log('Connected to MongoDB');

        // Find or create a test user to associate memorials with
        let testUser = await User.findOne({ email: 'testuser@memorial.com' });

        if (!testUser) {
            console.log('Creating test user...');
            testUser = await User.create({
                email: 'testuser@memorial.com',
                passwordHash: '$2a$10$X7ZQZ1Z5Z5Z5Z5Z5Z5Z5Z.euQQOWvlfy5JGWGSBlRS6uI2u1h4dce', // Dummy hash (password: "test123")
                isAdmin: false
            });
            console.log('Test user created');
        }

        console.log('Generating 20 test memorials...');

        const memorials = [];
        for (let i = 0; i < 20; i++) {
            const memorial = generateMemorial();
            memorial.createdBy = testUser._id;
            memorials.push(memorial);
        }

        console.log('Inserting memorials into database...');
        await Memorial.insertMany(memorials);

        console.log('✓ Successfully created 20 test memorials!');
        console.log('✓ All memorials are approved and ready to view');
        console.log('✓ Test user: testuser@memorial.com');

        process.exit(0);
    } catch (error) {
        console.error('Error generating test data:', error);
        process.exit(1);
    }
}

generateTestData();
