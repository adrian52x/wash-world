INSERT INTO wash_types (name, description, price, is_auto_wash) VALUES 
  ('Basic Wash', 'A simple basic wash.', 9.99, false),
  ('Deluxe Wash', 'Includes extra detailing and waxing.', 19.99, false),
  ('Auto Wash', 'Fully automated wash process.', 14.99, true),
  ('Premium Wash', 'Comprehensive cleaning with premium products.', 24.99, true);

  INSERT INTO memberships (price, wash_type_id) VALUES 
  (8.99, 1),
  (12.99, 2),
  (10.99, 3),
  (15.99, 4);

