const CONFIG = {
  "VERSION": "1.1.1-20260318-0445",
  "products": [
    {
      "category": "Logo Design",
      "featured": false,
      "id": "fvr-1",
      "image": "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/116239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg",
      "link": "https://go.fiverr.com/visit/?bta=your-id&ncp=1",
      "platform": "fiverr",
      "price": "From $50",
      "rating": 5,
      "title": "Professional Logo Design & Brand Identity"
    },
    {
      "category": "SEO",
      "featured": true,
      "id": "fvr-2",
      "image": "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/140239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8/gigs/140239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg",
      "link": "https://go.fiverr.com/visit/?bta=your-id&ncp=2",
      "platform": "fiverr",
      "price": "From $120",
      "rating": 4.9,
      "title": "Complete SEO Optimization for WordPress"
    },
    {
      "category": "Video Editing",
      "featured": false,
      "id": "fvr-3",
      "image": "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/150239169/original/e9f1f0e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8f8e8.jpg",
      "link": "https://go.fiverr.com/visit/?bta=your-id&ncp=3",
      "platform": "fiverr",
      "price": "From $75",
      "rating": 5,
      "title": "Advanced Video Editing for YouTube"
    },
    {
      "category": "Electronics",
      "deal": false,
      "featured": true,
      "id": "p-1773514551272",
      "image": "https://picsum.photos/401",
      "images": [
        "https://picsum.photos/401"
      ],
      "link": "https://amazon.com",
      "platform": "amazon",
      "price": "$ 19.99",
      "priceCurrency": "USD",
      "rating": 5,
      "title": "Test Product New"
    },
    {
      "id": "p-1773790256794",
      "title": "TruSkin Vitamin C Serum for Face – Anti Aging Face Serum with Hyaluronic Acid & Vitamin E – Brightening Formula for Improving Appearance of Dark Spots, Fine Lines & Wrinkles – All Skin Types, 1 fl oz",
      "images": [
        "data:image/png;base64,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VeT/PX0fPDhHFul+vOfWOf69r9P8ev/0n+uK/+0k/o/P6f6tX/x7tSxw+/p/r0f/t9389e87P7+/p/r0f/H6v89e87P/+/Z/z17yc/v7O/9fjp8fPz7X6v69Hz6fHp+fx6/f99O/56dfD/z1/v8+z56fP9eq/z0fDp+en5/Hp9/307/npm8P/PX+v69Hz/Pocen56fn8en3/fT/+en3w/X9fb+f7fP9fr8fn9vR8fHx6fn8en3/fT/+enf7/vj5uXW6fn8en3/HTz/P/1975eXPv19777ZPN1/P18vT/X6ff89f7fX6vP9+uzX6/u9fr8/T/X6vf89f7/X6vP9+uzX6/u9fr8/T/X6vf89f7/X6vP9+uzX6vK1+vz/X6vf89fL8/T1+vz9PX6/P09fr8/T1+vz9PX6/P09fr8/T1+vz9PPr+930d/6ffm5fn8vX6vP09fr8/T1+vz9PX6/P09fr8/T1+vz9PX6/P09fr79fX0ff69Pt69PT0fXt+dn5/f99PX8fXt+dnx6fnp+en5+fnp+fn56fnp+en56fnp+en56fnp+f36/fp+en56fnp+en56fnp+en56fnp+en56fnp+en56fnp+f36/X6/f99PX+fm5fn8fvp+vz9f7en6vP9+uzX6/u9fr8/T/X6vf89f7/X6vP9+uzX6/u9fr8/T1+vx9+vz7fH9fx+/y9fn8vx8/S9fr8f3+/x8/S9fr6vx+fz9P/6+1+P6/j9/l6/P5fj5+lz9P18vy9H6vP09frcv9/Xxf/z+/y9Pl6f6/L9fP6vN9fK/H5evqfP/9/n1+v6/T18vz8vy+f6fH6f/89fX8fPv+fz9Px6fHx6fHx6fHx6fHx6fHz9/vz+/z8vV5/ny9fn8vj6fP/fL8vy9vPy/r5vX8fn8/l9/H38vX5/u9fr7vy9f6vK/X5er0vXyv7/L8vy+f18vP0vb8/P0vp8/S9PL+vz9fHz8fXx8/Hx8/Hx8/Hx8/I="
      ],
      "category": "Beauty",
      "featured": true,
      "link": "https://amzn.to/3Z5rMId",
      "platform": "amazon",
      "price": "$15.00",
      "rating": 4.5
    },
    {
      "id": "p-1773791068053",
      "title": "asif",
      "images": [
        "data:image/png;base64,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W6V73f60Y9W6+f8/P7On+vVf+PrX69u88X3/16Nn/Dkt7uSnyhP89K/6dfR+8e7UscHk/yK8P209Xl6X6mD9vPy/SzVZbeX+nkivVeT/PX0fPDhHFul+vOfWOf69r9P8ev/0n+uK/+0k/o/P6f6tX/x7tSxw+/p/r0f/t9389e87P7+/p/r0f/H6v89e87P/+/Z/z17yc/v7O/9fjp8fPz7X6v69Hz6fHp+fx6/f99O/56dfD/z1/v8+z56fP9eq/z0fDp+en5/Hp9/307/npm8P/PX+v69Hz/Pocen56fn8en3/fT/+en3w/X9fb+f7fP9fr8fn9vR8fHx6fn8en3/fT/+enf7/vj5uXW6fn8en3/HTz/P/1975eXPv19777ZPN1/P18vT/X6ff89f7fX6vP9+uzX6/u9fr8/T/X6vf89f7/X6vP9+uzX6/u9fr8/T/X6vf89f7/X6vP9+uzX6vK1+vz/X6vf89fL8/T1+vz9PX6/P09fr8/T1+vz9PX6/P09fr8/T1+vz9PPr+930d/6ffm5fn8vX6vP09fr8/T1+vz9PX6/P09fr8/T1+vz9PX6/P09fr79fX0ff69Pt69PT0fXt+dn5/f99PX8fXt+dnx6fnp+en5+fnp+fn56fnp+en56fnp+en56fnp+f36/fp+en56fnp+en56fnp+en56fnp+en56fnp+en56fnp+f36/X6/f99PX+fm5fn8fvp+vz9f7en6vP9+uzX6/u9fr8/T/X6vf89f7/X6vP9+uzX6/u9fr8/T1+vx9+vz7fH9fx+/y9fn8vx8/S9fr8f3+/x8/S9fr6vx+fz9P/6+1+P6/j9/l6/P5fj5+lz9P18vy9H6vP09frcv9/Xxf/z+/y9Pl6f6/L9fP6vN9fK/H5evqfP/9/n1+v6/T18vz8vy+f6fH6f/89fX8fPv+fz9Px6fHx6fHx6fHx6fHx6fHz9/vz+/z8vV5/ny9fn8vj6fP/fL8vy9vPy/r5vX8fn8/l9/H38vX5/u9fr7vy9f6vK/X5er0vXyv7/L8vy+f18vP0vb8/P0vp8/S9PL+vz9fHz8fXx8/Hx8/Hx8/I="
      ],
      "category": "Beauty",
      "featured": true,
      "link": "https://amzn.to/3Z5rMId",
      "platform": "amazon",
      "price": "$15.00",
      "rating": 4.5
    }
  ],
  "platform_filters": {
    "fiverr": {
      "categories": [
        "Logo Design",
        "SEO",
        "Video Editing",
        "Web Development",
        "Graphic Design"
      ],
      "countries": {
        "ALL": "Worldwide",
        "US": "United States",
        "UK": "United Kingdom"
      }
    },
    "amazon": {
      "categories": [
        "Electronics",
        "Beauty",
        "Home",
        "Fashion",
        "Kitchen"
      ],
      "countries": {
        "US": "USA (Amazon.com)",
        "UK": "UK (Amazon.co.uk)",
        "DE": "Germany (Amazon.de)"
      }
    }
  },
  "site_settings": {
    "site_name": "Affiliate Hub",
    "contact_email": "support@affiliatehub.com",
    "currency": "USD"
  }
};
