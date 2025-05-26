import datasource from '../../data-source';

async function seed() {
  await datasource.initialize();

  // Seed locations
  await datasource.query(`
        INSERT INTO locations (name, address, opening_hours, auto_wash_halls, self_wash_halls, coordinates)
        VALUES 
        ('Nørrebro Wash Center', 'Nørrebrogade 50, 2200 København N', '6-22', 0, 4, '{"y":"55.6998","x":"12.5528"}'),
        ('Østerbro Clean Car', 'Østerbrogade 120, 2100 København Ø', '7-21', 1, 3, '{"y":"55.7047","x":"12.5769"}'),
        ('Vesterbro AutoWash', 'Vesterbrogade 150, 1620 København V', '0-24', 3, 2, '{"y":"55.6692","x":"12.5532"}'),
        ('Amager Wash Point', 'Amagerbrogade 200, 2300 København S', '8-20', 4, 0, '{"y":"55.6556","x":"12.6036"}'),
        ('Frederiksberg Shine', 'Falkoner Allé 80, 2000 Frederiksberg', '6-23', 3, 0, '{"y":"55.6796","x":"12.5331"}'),
        ('Indre By Car Spa', 'Gothersgade 20, 1123 København K', '7-22', 2, 3, '{"y":"55.678","x":"12.573"}'),
        ('Aalborg - Otto Mønstedsvej', 'Otto Mønsteds Vej 5, 9200 Aalborg', '7-22', 5, null, '{"y":"57.015248","x":"9.896256"}'),
        ('Aalborg, Gug - Gammel Vissevej', 'Gammel Vissevej 1C, 9210 Aalborg - Gug', '7-22', 2, null, '{"y":"57.00631387314069","x":"9.925946295261383"}'),
        ('Ballerup - Industriparken', 'Industriparken 6, 2750 Ballerup', '7-22', 2, 2, '{"y":"55.728714","x":"12.373295"}'),
        ('Brande - Vestergårdsvej', 'Vestergårdsvej 3, 7330 Brande', '7-22', 3, null, '{"y":"55.960647","x":"9.103426"}'),
        ('Brøndby Strand - Gl. Køge Landevej', 'Gammel Køge Landevej 690, 2660 Brøndby Strand', '7-22', 4, null, '{"y":"55.618231","x":"12.423950"}'),
        ('Ebeltoft - Færgevejen', 'Færgevejen 3, 8400 Ebeltoft', '7-22', 4, null, '{"y":"56.1908092","x":"10.672123100000022"}'),
        ('Esbjerg - Sædding Ringvej', 'Sædding Ringvej 6, 6710 Esbjerg', '7-22', 2, null, '{"y":"55.5037278","x":"8.40741920000005"}'),
        ('Farum - Gammelgårdsvej', 'Gammelgårdsvej 84, 3520 Farum', '7-22', 1, 3, '{"y":55.816943,"x":12.37035}');
    `);
  console.log('Locations seeded!');

  // Seed wash types
  await datasource.query(`
        INSERT INTO wash_types (type, description, price, is_auto_wash) VALUES 
        ('GOLD', 'A simple basic wash.', 59, true),
        ('PREMIUM', 'Includes extra detailing and waxing.', 89, true),
        ('BRILLIANT', 'Fully automated wash process.', 119, true),
        ('SELF_WASH', 'Comprehensive cleaning with premium products.', 6, false);
    `);
  console.log('Wash types seeded!');

  // Seed memberships
  await datasource.query(`
        INSERT INTO memberships (type, price, wash_type_id) VALUES 
        ('GOLD', 139, 1),
        ('PREMIUM', 169, 2),
        ('BRILLIANT', 199, 3);

    `);
  console.log('Memberships seeded!');

  await datasource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
