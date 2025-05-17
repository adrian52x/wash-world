import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fooPath = path.join(__dirname, 'locations.txt');
const data = fs.readFileSync(fooPath, 'utf8');

let locations = [];
try {
  locations = JSON.parse(data);
} catch (e) {
  console.error('Error parsing JSON from locations.txt:', e);
  process.exit(1);
}

const values = [];

locations.forEach(loc => {
  const escape = (str) =>
    typeof str === 'string' ? str.replace(/'/g, "''") : String(str);

  const name = escape(loc.name);
  const address = escape(loc.address);
  const opening_hours = escape(loc.open_hours);

  const selfWashCount = loc.service_units && loc.service_units.self_wash && loc.service_units.self_wash.total_count
    ? loc.service_units.self_wash.total_count
    : 0;

  const self_wash_halls = selfWashCount === 0 ? 'null' : selfWashCount;

  const auto_wash_halls = Math.floor(Math.random() * 5) + 1;

  const coordinates = escape(JSON.stringify(loc.coordinates));

  const valueSet = `('${name}', '${address}', '${opening_hours}', ${auto_wash_halls}, ${self_wash_halls}, '${coordinates}')`;
  values.push(valueSet);
});

if (values.length === 0) {
  console.error('No locations available for INSERT.');
  process.exit(1);
}

const sqlInsert = `INSERT INTO locations (name, address, opening_hours, auto_wash_halls, self_wash_halls, coordinates)
VALUES ${values.join(',\n')};`;

const outputFile = path.join(__dirname, 'location-insert.sql');
fs.writeFileSync(outputFile, sqlInsert, 'utf8');
console.log(`SQL insert statement has been written to ${outputFile}`);