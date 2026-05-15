const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const bcrypt = require('bcrypt');
const {
  sequelize,
  User,
  Category,
  Product,
  ProductCategory,
} = require('../models');

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

async function seed() {
  await sequelize.authenticate();
  const isDev = process.env.NODE_ENV !== 'production';
  await sequelize.sync({ alter: isDev });

  const categoriesData = [
    { name: 'Electrónica', slug: 'electronica' },
    { name: 'Ropa', slug: 'ropa' },
    { name: 'Libros', slug: 'libros' },
  ];

  const categoryBySlug = {};
  for (const row of categoriesData) {
    const [cat] = await Category.findOrCreate({
      where: { slug: row.slug },
      defaults: row,
    });
    categoryBySlug[row.slug] = cat;
  }

  const productsData = [
    {
      name: 'Auriculares Bluetooth',
      description: 'Audio nítido y batería de larga duración.',
      price: 89900,
      stock: 40,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30?w=600',
      categorySlugs: ['electronica'],
    },
    {
      name: 'Teclado mecánico',
      description: 'Switches táctiles, retroiluminación.',
      price: 249900,
      stock: 25,
      imageUrl:
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
      categorySlugs: ['electronica'],
    },
    {
      name: 'Camiseta algodón',
      description: 'Corte relaxed, varios colores.',
      price: 59000,
      stock: 80,
      imageUrl:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      categorySlugs: ['ropa'],
    },
    {
      name: 'Chaqueta impermeable',
      description: 'Ideal para clima frío y lluvia.',
      price: 189900,
      stock: 30,
      imageUrl:
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600',
      categorySlugs: ['ropa'],
    },
    {
      name: 'Introducción a bases de datos',
      description: 'Fundamentos SQL y modelado relacional.',
      price: 45000,
      stock: 100,
      imageUrl:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      categorySlugs: ['libros'],
    },
    {
      name: 'Node.js en práctica',
      description: 'APIs REST, async/await y ecosistema npm.',
      price: 52000,
      stock: 60,
      imageUrl:
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600',
      categorySlugs: ['libros', 'electronica'],
    },
  ];

  for (const item of productsData) {
    const { categorySlugs, ...productFields } = item;
    const [product] = await Product.findOrCreate({
      where: { name: productFields.name },
      defaults: productFields,
    });

    for (const slug of categorySlugs) {
      const cat = categoryBySlug[slug];
      if (!cat) continue;
      await ProductCategory.findOrCreate({
        where: { productId: product.id, categoryId: cat.id },
        defaults: { productId: product.id, categoryId: cat.id },
      });
    }
  }

  const adminPassword = await bcrypt.hash('Admin123!', BCRYPT_ROUNDS);
  const customerPassword = await bcrypt.hash('Juan123!', BCRYPT_ROUNDS);

  await User.findOrCreate({
    where: { email: 'admin@marketapi.com' },
    defaults: {
      name: 'Administrador',
      password: adminPassword,
      role: 'admin',
    },
  });

  await User.findOrCreate({
    where: { email: 'juan@test.com' },
    defaults: {
      name: 'Juan Pérez',
      password: customerPassword,
      role: 'customer',
    },
  });
}

seed()
  .then(() => sequelize.close())
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
