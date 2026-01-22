const fs = require('fs');

// Read the first 629 lines
const css = fs.readFileSync('src/app/globals.css', 'utf8')
    .split('\n')
    .slice(0, 629)
    .join('\n');

// Add mobile utilities
const extra = `
.hover\\:scale-102:hover { transform: scale(1.02); }
.scale-105 { transform: scale(1.05); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.leading-tight { line-height: 1.25; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.max-h-\\[240px\\] { max-height: 240px; }
.max-h-\\[280px\\] { max-height: 280px; }
.min-h-\\[280px\\] { min-height: 280px; }
.min-h-\\[320px\\] { min-height: 320px; }
@media (min-width: 640px) {
  .sm\\:text-base { font-size: 1rem; }
  .sm\\:text-lg { font-size: 1.125rem; }
  .sm\\:text-4xl { font-size: 2.25rem; }
  .sm\\:text-5xl { font-size: 3rem; }
  .sm\\:p-8 { padding: 2rem; }
  .sm\\:py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .sm\\:min-h-\\[320px\\] { min-height: 320px; }
  .sm\\:max-h-\\[280px\\] { max-height: 280px; }
}
@media (min-width: 768px) {
  .md\\:text-5xl { font-size: 3rem; }
}`;

fs.writeFileSync('src/app/globals.css', css + extra, 'utf8');
console.log('CSS fixed successfully!');
