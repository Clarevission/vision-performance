const fs = require('fs');
const f = fs.readFileSync('public/index.html', 'utf8');

// The nav HTML must be in a JS template literal. Search in the JS portion only.
// Find where </style> ends and <script> begins
const styleEnd = f.lastIndexOf('</style>');
const scriptStart = f.indexOf('<script', styleEnd);
console.log('Style ends at char:', styleEnd, 'line:', f.slice(0,styleEnd).split('\n').length);
console.log('Script starts at char:', scriptStart, 'line:', f.slice(0,scriptStart).split('\n').length);

// Check content between </style> and first <script>
const betweenStyleScript = f.slice(styleEnd, scriptStart);
console.log('\nContent between </style> and <script>:');
console.log(betweenStyleScript.slice(0, 2000));
