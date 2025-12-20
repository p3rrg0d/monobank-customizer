const fs = require('fs');
const path = require('path');

const presetsFilePath = path.join(process.cwd(), 'src/data/Presets.js');
const rawContent = fs.readFileSync(presetsFilePath, 'utf8');

// Simple regex to extract individual preset objects. 
// We look for objects inside the PRESETS array.
const presetsArrayMatch = rawContent.match(/export const PRESETS = \[\s*([\s\S]*)\s*\];/);
if (!presetsArrayMatch) {
    console.error('Could not find PRESETS array');
    process.exit(1);
}

const presetsStr = presetsArrayMatch[1];
// Split by "{ name:" but keep "{ name:"
const presetBlocks = presetsStr.split(/(?=\s*{\s*name:)/).filter(p => p.trim().length > 0);

const nameToBlock = {};
presetBlocks.forEach(block => {
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    if (nameMatch) {
        nameToBlock[nameMatch[1]] = block.trim();
    }
});

const desiredOrder = [
    'Standard Dark (Стандарт)',
    'Clean White (Світлий)',
    'Minimal Grey (Мінімал)',
    'Glassmorphism (Скляний)',
    'Transparent (Прозорий)',
    'Candy Cane (Льодяник)',
    'Lava (Лава)',
    'Christmas (Різдвяний)',
    'Vibrant Orange (Драйв)',
    'Sunset (Захід Сонця)',
    'Autumn (Осінь)',
    'Coffee (Кавовий)',
    'Midnight Gold (Золото)',
    'Mint Fresh (Свіжа М\'ята)',
    'Forest (Ліс)',
    'Nature Moss (Мох)',
    'Terminal (Термінал)',
    'Patriotic (Патріотичний)',
    'Deep Sea (Безодня)',
    'Ice (Крижаний)',
    'Deep Space (Глибокий Космос)',
    'Royal Velvet (Оксамит)',
    'Cotton Candy (Цукрова Вата)',
    'Sunset Rose (Троянда)',
    'Sakura (Сакура)',
    'Barbie (Барбі)',
    'Pastel (Пастель)',
    'Dark Luxury (Темний Люкс)',
    'Liquid Glass (Рідке Скло)',
    'Monochrome (Монохром)'
];

const newPresetsArrayContent = desiredOrder.map(name => {
    if (nameToBlock[name]) {
        return '    ' + nameToBlock[name];
    } else {
        console.warn(`Warning: Preset "${name}" not found!`);
        return '';
    }
}).filter(p => p.length > 0).join(',\n\n');

const newFileContent = `export const PRESETS = [\n${newPresetsArrayContent}\n];\n`;
fs.writeFileSync(presetsFilePath, newFileContent);
console.log('Presets reordered successfully!');
