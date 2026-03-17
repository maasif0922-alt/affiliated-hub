const fs = require('fs');

const userData = {
  "products": [
    {
      "id": "fvr-2",
      "platform": "fiverr",
      "title": "Complete SEO Optimization for WordPress",
      "price": "From $120",
      "rating": 4.9,
      "image": "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/140239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg",
      "featured": true,
      "category": "SEO",
      "link": "https://go.fiverr.com/visit/?bta=your-id&ncp=2"
    },
    {
      "id": "p-1773520452512",
      "title": "Wireless Earbuds, Bluetooth 5.4 Headphones Bass Stereo, Ear Buds with Noise Cancelling Mic, LED Display in Ear Earphones Clear Calls, IP7 Waterproof Bluetooth Earbuds for Phones/Sports/Laptop, Black",
      "images": [
        "https://m.media-amazon.com/images/I/71wK8n07wBL._AC_SX679_.jpg",
        "https://m.media-amazon.com/images/I/718yF8d5ZzL._AC_SX679_.jpg"
      ],
      "image": "https://m.media-amazon.com/images/I/71wK8n07wBL._AC_SX679_.jpg",
      "link": "https://amzn.to/3ZYZABC",
      "platform": "amazon",
      "price": "$ 23.99",
      "oldPrice": "$ 89.99",
      "priceCurrency": "USD",
      "category": "Electronics",
      "country": "all",
      "featured": true,
      "rating": 5,
      "deal": false
    },
    {
      "id": "p-1773520556634",
      "title": "Portable Charger Power Bank 10000mAh, 2-Pack Dual USB Output USB-C in External Battery Pack, Backup Power Bank Compatible with iPhone 15/14/13/12/11/X, Samsung Galaxy, iPad, and More (Black+White)",
      "images": [
        "https://m.media-amazon.com/images/I/61b7U+ON-mL._AC_SX679_.jpg"
      ],
      "image": "https://m.media-amazon.com/images/I/61b7U+ON-mL._AC_SX679_.jpg",
      "link": "https://amzn.to/4gYXYZQ",
      "platform": "amazon",
      "price": "$ 19.99",
      "oldPrice": "$ 24.99",
      "priceCurrency": "USD",
      "category": "Electronics",
      "country": "all",
      "featured": true,
      "rating": 5,
      "deal": false
    },
    {
      "id": "p-1773520770513",
      "title": "Smart Watch Men Women (Answer/Make Calls), 1.96\" Smart Watches for Android iOS Phone, Fitness Tracker Watch with Heart Rate/Sleep/SpO2 Monitor, IP68 Waterproof Digital Sport Watch",
      "images": [
        "https://m.media-amazon.com/images/I/71tQ9oA5F0L._AC_SX679_.jpg"
      ],
      "image": "https://m.media-amazon.com/images/I/71tQ9oA5F0L._AC_SX679_.jpg",
      "link": "https://amzn.to/3YgW1Xy",
      "platform": "amazon",
      "price": "$ 29.99",
      "oldPrice": "$ 69.99",
      "priceCurrency": "USD",
      "category": "Electronics",
      "country": "all",
      "featured": true,
      "rating": 5,
      "deal": false
    }
  ]
};

// Write this down so the page can pick it up
fs.writeFileSync('c:/Users/PC/Desktop/affliated program website/affiliated-hub/temp-data.json', JSON.stringify(userData, null, 2));

console.log("Written temp-data.json successfully.");
