"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const india = await prisma.country.upsert({
        where: { code: 'IN' },
        update: {},
        create: { name: 'India', code: 'IN' },
    });
    const america = await prisma.country.upsert({
        where: { code: 'US' },
        update: {},
        create: { name: 'America', code: 'US' },
    });
    const hash = (p) => bcrypt.hash(p, 10);
    await prisma.user.upsert({
        where: { email: 'admin.india@food.com' },
        update: {},
        create: {
            name: 'Arjun Admin',
            email: 'admin.india@food.com',
            password: await hash('password123'),
            role: 'ADMIN',
            countryId: india.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'manager.india@food.com' },
        update: {},
        create: {
            name: 'Meera Manager',
            email: 'manager.india@food.com',
            password: await hash('password123'),
            role: 'MANAGER',
            countryId: india.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'member.india@food.com' },
        update: {},
        create: {
            name: 'Ravi Member',
            email: 'member.india@food.com',
            password: await hash('password123'),
            role: 'MEMBER',
            countryId: india.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'admin.us@food.com' },
        update: {},
        create: {
            name: 'Alice Admin',
            email: 'admin.us@food.com',
            password: await hash('password123'),
            role: 'ADMIN',
            countryId: america.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'manager.us@food.com' },
        update: {},
        create: {
            name: 'Mike Manager',
            email: 'manager.us@food.com',
            password: await hash('password123'),
            role: 'MANAGER',
            countryId: america.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'member.us@food.com' },
        update: {},
        create: {
            name: 'Sara Member',
            email: 'member.us@food.com',
            password: await hash('password123'),
            role: 'MEMBER',
            countryId: america.id,
        },
    });
    const spiceGarden = await prisma.restaurant.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Spice Garden',
            address: '12 MG Road, Bangalore',
            countryId: india.id,
        },
    });
    const tandoorHouse = await prisma.restaurant.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Tandoor House',
            address: '45 Connaught Place, Delhi',
            countryId: india.id,
        },
    });
    const burgerBarn = await prisma.restaurant.upsert({
        where: { id: 3 },
        update: {},
        create: {
            name: 'Burger Barn',
            address: '101 Main St, Austin TX',
            countryId: america.id,
        },
    });
    const pizzaPalace = await prisma.restaurant.upsert({
        where: { id: 4 },
        update: {},
        create: {
            name: 'Pizza Palace',
            address: '77 Broadway, New York NY',
            countryId: america.id,
        },
    });
    const spiceItems = [
        { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 320, category: 'Main Course' },
        { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 260, category: 'Starters' },
        { name: 'Garlic Naan', description: 'Soft bread with garlic butter', price: 60, category: 'Breads' },
        { name: 'Mango Lassi', description: 'Sweet yogurt mango drink', price: 80, category: 'Drinks' },
        { name: 'Dal Makhani', description: 'Slow cooked black lentils in butter', price: 240, category: 'Main Course' },
    ];
    for (const item of spiceItems) {
        await prisma.menuItem.upsert({
            where: { id: spiceItems.indexOf(item) + 1 },
            update: {},
            create: { ...item, restaurantId: spiceGarden.id },
        });
    }
    const tandoorItems = [
        { name: 'Chicken Biryani', description: 'Aromatic basmati rice with chicken', price: 380, category: 'Rice' },
        { name: 'Seekh Kebab', description: 'Minced lamb skewers from the tandoor', price: 340, category: 'Starters' },
        { name: 'Raita', description: 'Yogurt with cucumber and cumin', price: 60, category: 'Sides' },
        { name: 'Gulab Jamun', description: 'Soft milk dumplings in sugar syrup', price: 120, category: 'Desserts' },
        { name: 'Masala Chai', description: 'Spiced Indian tea', price: 40, category: 'Drinks' },
    ];
    for (const item of tandoorItems) {
        await prisma.menuItem.upsert({
            where: { id: tandoorItems.indexOf(item) + 6 },
            update: {},
            create: { ...item, restaurantId: tandoorHouse.id },
        });
    }
    const burgerItems = [
        { name: 'Classic Smash Burger', description: 'Double smashed patty with American cheese', price: 13.99, category: 'Burgers' },
        { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce with crispy bacon', price: 15.99, category: 'Burgers' },
        { name: 'Loaded Fries', description: 'Fries with cheese sauce and jalapeños', price: 7.99, category: 'Sides' },
        { name: 'Chocolate Shake', description: 'Thick hand-spun chocolate milkshake', price: 6.49, category: 'Drinks' },
        { name: 'Chicken Tenders', description: '5-piece crispy chicken tenders', price: 11.99, category: 'Starters' },
    ];
    for (const item of burgerItems) {
        await prisma.menuItem.upsert({
            where: { id: burgerItems.indexOf(item) + 11 },
            update: {},
            create: { ...item, restaurantId: burgerBarn.id },
        });
    }
    const pizzaItems = [
        { name: 'Pepperoni Pizza', description: '12" pizza with mozzarella and pepperoni', price: 16.99, category: 'Pizzas' },
        { name: 'Margherita Pizza', description: 'Fresh basil, tomato sauce, mozzarella', price: 14.99, category: 'Pizzas' },
        { name: 'Caesar Salad', description: 'Romaine, croutons, parmesan, caesar dressing', price: 9.99, category: 'Salads' },
        { name: 'Garlic Bread', description: 'Toasted baguette with garlic butter', price: 5.99, category: 'Sides' },
        { name: 'Tiramisu', description: 'Classic Italian espresso dessert', price: 7.99, category: 'Desserts' },
    ];
    for (const item of pizzaItems) {
        await prisma.menuItem.upsert({
            where: { id: pizzaItems.indexOf(item) + 16 },
            update: {},
            create: { ...item, restaurantId: pizzaPalace.id },
        });
    }
    console.log('Seeding complete!');
    console.log('');
    console.log('Test accounts (password: password123):');
    console.log('  India  -> admin.india@food.com  | manager.india@food.com  | member.india@food.com');
    console.log('  America-> admin.us@food.com     | manager.us@food.com     | member.us@food.com');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map