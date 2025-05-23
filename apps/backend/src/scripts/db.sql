INSERT INTO wash_types (type, description, price, is_auto_wash) VALUES 
  ('GOLD', 'A simple basic wash.', 59, true),
  ('PREMIUM', 'Includes extra detailing and waxing.', 89, true),
  ('BRILLIANT', 'Fully automated wash process.', 119, true),
  ('SELF_WASH', 'Comprehensive cleaning with premium products.', 6, false);

  INSERT INTO memberships (type, price, wash_type_id) VALUES 
  ('GOLD', 139, 1),
  ('PREMIUM', 169, 2),
  ('BRILLIANT', 199, 3)