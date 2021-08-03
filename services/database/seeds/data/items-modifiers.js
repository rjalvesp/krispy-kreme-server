const customDonuts = [
  { name: "Ring Relleno Cajeta", group: "Donas" },
  { name: "Dona Original Glaseada", group: "Donas" },
  { name: "Ring Maple", group: "Donas" },
  { name: "Ring de Brownie", group: "Donas" },
  { name: "Dona Rellena de Manzana y Canela", group: "Donas" },
  { name: "Dona Rellena de Frambuesa", group: "Donas" },
  { name: "Dona Mis Pastelitos", group: "Donas" },
];

const coffees = [
  { name: "Café Regular", group: "Café" },
  { name: "Café Descafeinado", group: "Café" },
];
const milks = [
  { name: "Leche Entera", group: "Leches" },
  { name: "Leche Light", group: "Leches", price: 10 },
  { name: "Leche Deslactosada", group: "Leches", price: 10 },
  { name: "Leche de Coco", group: "Leches", price: 10 },
  { name: "Leche de Soya", group: "Leches", price: 10 },
];
const shots = [
  { name: "Shot Almendra", group: "Shots", price: 10 },
  { name: "Shot Crema Irlandesa", group: "Shots", price: 10 },
  { name: "Shot Canela", group: "Shots", price: 10 },
  { name: "Shot Avellana", group: "Shots", price: 10 },
  { name: "Shot Vainilla", group: "Shots", price: 10 },
  { name: "Crema Batida", group: "Shots", price: 10 },
];

module.exports = [
  {
    name: "Docena Select",
    max: 12,
    modifiers: customDonuts,
  },
  {
    name: "Media Docena Select",
    max: 6,
    modifiers: customDonuts,
  },
  {
    name: "Mix de Alegría",
    max: 6,
    modifiers: customDonuts,
  },
  {
    name: "Café Americano Caliente 20 oz",
    modifiers: coffees,
  },
  {
    name: "Café Latte Caliente 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Cappuccino Caliente 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Mocha Oscuro Caliente 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Kaffe Kreme Caliente 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Te Chai Latte Caliente 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Green Latte Matcha Caliente 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Chocolate Oscuro Caliente 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Triple Chocolate Caliente 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Café Americano Caliente 16 oz",
    modifiers: coffees,
  },
  {
    name: "Café Cappuccino Caliente 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Latte Caliente 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Mocha Oscuro Caliente 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Kaffe Kreme Caliente 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Te Chai Latte Caliente 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Green Latte Matcha Caliente 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Chocolate Oscuro Caliente 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Triple Chocolate Caliente 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Café Cappuccino Frío 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Cappuccino Frozen 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Americano Frío 20 oz",
    modifiers: coffees,
  },
  {
    name: "Café Latte Frío 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Mocha Oscuro Frío 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Mocha Oscuro Frozen 20 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Kaffe Kreme Frío 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Te Chai Latte Frío 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Te Chai Latte Frozen 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Green Latte Matcha Frío 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Green Latte Matcha Frozen 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Chocolate Oscuro Frío 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Chocolate Frozen 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Triple Chocolate Frío 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Triple Chocolate Frozen 20 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Café Cappuccino Frío 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Cappuccino Frozen 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Americano Frío 16 oz",
    modifiers: coffees,
  },
  {
    name: "Café Latte Frío 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Mocha Oscuro Frío 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Café Mocha Oscuro Frozen 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Kaffe Kreme Frío 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Te Chai Latte Frío 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Te Chai Latte Frozen 16 oz",
    modifiers: [...coffees, ...milks, ...shots],
  },
  {
    name: "Green Latte Matcha Frío 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Green Latte Matcha Frozen 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Chocolate Oscuro Frío 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Chocolate Frozen 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Triple Chocolate Frío 16 oz",
    modifiers: [...milks, ...shots],
  },
  {
    name: "Triple Chocolate Frozen 16 oz",
    modifiers: [...milks, ...shots],
  },
];
