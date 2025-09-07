INSERT INTO product_categories (id, name, is_active, created_at, updated_at, deleted_at) VALUES
(1, 'Milk Tea', 'Y', NOW(), NOW(), NULL),
(2, 'Fruit Tea', 'Y', NOW(), NOW(), NULL),
(3, 'Toppings', 'Y', NOW(), NOW(), NULL),
(4, 'Snacks', 'Y', NOW(), NOW(), NULL);

INSERT INTO addons (id, name, base_price, deleted_at, created_at, updated_at) VALUES
(1, 'Pearl (Tapioca)', 10.00, NULL, NOW(), NOW()),
(2, 'Nata de Coco', 12.00, NULL, NOW(), NOW()),
(3, 'Coffee Jelly', 12.00, NULL, NOW(), NOW()),
(4, 'Cheese Foam', 20.00, NULL, NOW(), NOW()),
(5, 'Egg Pudding', 15.00, NULL, NOW(), NOW()),
(6, 'Aloe Vera', 12.00, NULL, NOW(), NOW()),
(7, 'Brown Sugar Syrup', 15.00, NULL, NOW(), NOW()),
(8, 'Oreo Crumbs', 15.00, NULL, NOW(), NOW());

INSERT INTO products (id, sku, name, description, category_id, quantity_on_hand, reorder_point, supplier_id, cost_price, selling_price, is_active, image, created_at, updated_at, deleted_at) VALUES
-- Milk Tea
(1, 'MT001', 'Classic Milk Tea', 'Black tea with milk', 1, 50, 10, 1, 40.00, 80.00, 'Y', 'classic.jpg', NOW(), NOW(), NULL),
(2, 'MT002', 'Wintermelon Milk Tea', 'Sweet wintermelon blend', 1, 50, 10, 1, 45.00, 90.00, 'Y', 'wintermelon.jpg', NOW(), NOW(), NULL),
(3, 'MT003', 'Okinawa Milk Tea', 'Brown sugar caramel taste', 1, 50, 10, 1, 50.00, 95.00, 'Y', 'okinawa.jpg', NOW(), NOW(), NULL),
(4, 'MT004', 'Thai Milk Tea', 'Thai-style spiced tea', 1, 30, 5, 1, 45.00, 90.00, 'Y', 'thai.jpg', NOW(), NOW(), NULL),
(5, 'MT005', 'Matcha Milk Tea', 'Green tea with milk', 1, 40, 8, 1, 55.00, 100.00, 'Y', 'matcha.jpg', NOW(), NOW(), NULL),
(6, 'MT006', 'Hokkaido Milk Tea', 'Creamy vanilla caramel flavor', 1, 40, 8, 1, 50.00, 95.00, 'Y', 'hokkaido.jpg', NOW(), NOW(), NULL),
(7, 'MT007', 'Taro Milk Tea', 'Sweet purple taro root flavor', 1, 40, 8, 1, 45.00, 90.00, 'Y', 'taro.jpg', NOW(), NOW(), NULL),
(8, 'MT008', 'Chocolate Milk Tea', 'Rich chocolate with milk tea', 1, 40, 8, 1, 45.00, 90.00, 'Y', 'choco.jpg', NOW(), NOW(), NULL),
(9, 'MT009', 'Red Velvet Milk Tea', 'Red velvet cake inspired tea', 1, 30, 6, 1, 50.00, 95.00, 'Y', 'redvelvet.jpg', NOW(), NOW(), NULL),
(10, 'MT010', 'Caramel Milk Tea', 'Milk tea with caramel sweetness', 1, 30, 6, 1, 50.00, 95.00, 'Y', 'caramel.jpg', NOW(), NOW(), NULL),

-- Fruit Tea
(11, 'FT001', 'Mango Fruit Tea', 'Refreshing mango flavor', 2, 40, 8, 1, 35.00, 75.00, 'Y', 'mango.jpg', NOW(), NOW(), NULL),
(12, 'FT002', 'Strawberry Fruit Tea', 'Sweet strawberry taste', 2, 40, 8, 1, 35.00, 75.00, 'Y', 'strawberry.jpg', NOW(), NOW(), NULL),
(13, 'FT003', 'Lychee Fruit Tea', 'Light and fragrant lychee tea', 2, 40, 8, 1, 35.00, 75.00, 'Y', 'lychee.jpg', NOW(), NOW(), NULL),
(14, 'FT004', 'Passionfruit Fruit Tea', 'Tangy tropical passionfruit tea', 2, 40, 8, 1, 35.00, 75.00, 'Y', 'passionfruit.jpg', NOW(), NOW(), NULL),
(15, 'FT005', 'Grapefruit Fruit Tea', 'Citrusy grapefruit refreshment', 2, 35, 7, 1, 38.00, 78.00, 'Y', 'grapefruit.jpg', NOW(), NOW(), NULL),
(16, 'FT006', 'Blueberry Fruit Tea', 'Sweet and tart blueberry flavor', 2, 35, 7, 1, 38.00, 78.00, 'Y', 'blueberry.jpg', NOW(), NOW(), NULL),

-- Snacks
(17, 'SN001', 'Takoyaki (6pcs)', 'Japanese octopus balls', 4, 20, 5, 1, 60.00, 120.00, 'Y', 'takoyaki.jpg', NOW(), NOW(), NULL),
(18, 'SN002', 'Fries', 'Crispy french fries', 4, 30, 6, 1, 40.00, 85.00, 'Y', 'fries.jpg', NOW(), NOW(), NULL),
(19, 'SN003', 'Hashbrown', 'Golden crispy hashbrown', 4, 25, 5, 1, 35.00, 70.00, 'Y', 'hashbrown.jpg', NOW(), NOW(), NULL),
(20, 'SN004', 'Cheese Sticks', 'Fried cheese sticks', 4, 25, 5, 1, 35.00, 70.00, 'Y', 'cheesesticks.jpg', NOW(), NOW(), NULL);

INSERT INTO product_addons (id, product_id, addon_id, custom_price, deleted_at, created_at, updated_at) VALUES
(1, 1, 1, 10.00, NULL, NOW(), NOW()), -- Classic + Pearl
(2, 2, 4, 20.00, NULL, NOW(), NOW()), -- Wintermelon + Cheese Foam
(3, 3, 7, 15.00, NULL, NOW(), NOW()), -- Okinawa + Brown Sugar
(4, 4, 5, 15.00, NULL, NOW(), NOW()), -- Thai + Egg Pudding
(5, 5, 2, 12.00, NULL, NOW(), NOW()), -- Matcha + Nata
(6, 6, 3, 12.00, NULL, NOW(), NOW()), -- Hokkaido + Coffee Jelly
(7, 7, 1, 10.00, NULL, NOW(), NOW()), -- Taro + Pearl
(8, 8, 8, 15.00, NULL, NOW(), NOW()), -- Chocolate + Oreo
(9, 9, 4, 20.00, NULL, NOW(), NOW()), -- Red Velvet + Cheese Foam
(10, 10, 1, 10.00, NULL, NOW(), NOW()), -- Caramel + Pearl
(11, 11, 2, 12.00, NULL, NOW(), NOW()), -- Mango + Nata
(12, 12, 1, 10.00, NULL, NOW(), NOW()), -- Strawberry + Pearl
(13, 13, 6, 12.00, NULL, NOW(), NOW()), -- Lychee + Aloe Vera
(14, 14, 3, 12.00, NULL, NOW(), NOW()), -- Passionfruit + Coffee Jelly
(15, 15, 2, 12.00, NULL, NOW(), NOW()), -- Grapefruit + Nata
(16, 16, 6, 12.00, NULL, NOW(), NOW()); -- Blueberry + Aloe Vera
