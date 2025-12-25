const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock marketplace listings
let mockListings = [
  {
    id: 'listing_001',
    item: {
      id: 'item_001',
      name: 'Plasma Rifle',
      itemType: 'weapon',
      stats: { damage: 45, accuracy: 85 }
    },
    sellerId: 'seller1',
    price: 1500,
    listingType: 'fixed_price',
    createdAt: new Date().toISOString()
  },
  {
    id: 'listing_002',
    item: {
      id: 'item_002',
      name: 'Shield Generator',
      itemType: 'armor',
      stats: { defense: 30, energy: 100 }
    },
    sellerId: 'seller2',
    price: 800,
    listingType: 'auction',
    currentBid: 850,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

app.get('/listings', (req, res) => {
  const { category, itemType, minPrice, maxPrice, limit } = req.query;

  console.log('[Marketplace Service Mock] Getting listings with filters:', req.query);

  let filteredListings = [...mockListings];

  // Apply filters
  if (itemType) {
    filteredListings = filteredListings.filter(listing => listing.item.itemType === itemType);
  }

  if (minPrice) {
    filteredListings = filteredListings.filter(listing => listing.price >= parseInt(minPrice));
  }

  if (maxPrice) {
    filteredListings = filteredListings.filter(listing => listing.price <= parseInt(maxPrice));
  }

  if (limit) {
    filteredListings = filteredListings.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    listings: filteredListings
  });
});

app.post('/listings', (req, res) => {
  const { item, price, listingType, sellerId } = req.body;

  console.log('[Marketplace Service Mock] Creating listing for:', item.name);

  const newListing = {
    id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    item,
    sellerId,
    price: parseInt(price),
    listingType: listingType || 'fixed_price',
    createdAt: new Date().toISOString()
  };

  mockListings.push(newListing);

  res.json({
    success: true,
    listing: newListing
  });
});

app.post('/purchase/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  const { buyerId } = req.body;

  console.log('[Marketplace Service Mock] Processing purchase:', listingId, 'by:', buyerId);

  const listing = mockListings.find(l => l.id === listingId);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  // Remove listing (sold)
  mockListings = mockListings.filter(l => l.id !== listingId);

  res.json({
    success: true,
    purchase: {
      listingId,
      buyerId,
      sellerId: listing.sellerId,
      item: listing.item,
      price: listing.price,
      completedAt: new Date().toISOString()
    }
  });
});

app.delete('/listings/:listingId', (req, res) => {
  const listingId = req.params.listingId;

  console.log('[Marketplace Service Mock] Canceling listing:', listingId);

  const listingIndex = mockListings.findIndex(l => l.id === listingId);
  if (listingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const listing = mockListings[listingIndex];
  mockListings.splice(listingIndex, 1);

  res.json({
    success: true,
    listing: listing
  });
});

app.get('/inventory/:userId', (req, res) => {
  const userId = req.params.userId;

  console.log('[Marketplace Service Mock] Getting inventory for:', userId);

  // Mock inventory
  const mockInventory = [
    {
      id: 'inv_001',
      name: 'Basic Blaster',
      itemType: 'weapon',
      stats: { damage: 25, accuracy: 70 }
    },
    {
      id: 'inv_002',
      name: 'Scrap Metal',
      itemType: 'material',
      quantity: 50
    }
  ];

  res.json({
    success: true,
    items: mockInventory
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'marketplace-service-mock',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`🚀 Marketplace Service Mock running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
