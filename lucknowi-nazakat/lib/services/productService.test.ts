import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeProduct, resolveStockValue } from './productService';

test('resolveStockValue maps inStock to stock and keeps zero when out of stock', () => {
  assert.equal(resolveStockValue({ inStock: true }), 10);
  assert.equal(resolveStockValue({ inStock: false }), 0);
  assert.equal(resolveStockValue({ stock: 5 }), 5);
});

test('normalizeProduct exposes a stable image and inStock flag', () => {
  const product = normalizeProduct({
    id: '1',
    name: 'Kurti',
    price: 1200,
    category: 'Kurtis',
    description: 'Lovely',
    imageUrl: 'https://example.com/kurti.jpg',
    inStock: false,
  });

  assert.equal(product.image, 'https://example.com/kurti.jpg');
  assert.deepEqual(product.images, ['https://example.com/kurti.jpg']);
  assert.equal(product.inStock, false);
  assert.equal(product.stock, 0);
});
