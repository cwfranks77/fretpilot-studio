node scripts\search_console_verify.js meta --code=YOUR_CODE --file=index.htmlfretpilotstudio.comfretpilotstudio.com
602995
#!/usr/bin/env node
/*
  Composites the slogan "PREMIUM INSTRUMENTS. SERVICE STANDARD." onto a temple photo
  without altering the original, using Sharp to render an SVG overlay at a precise position.

  Usage:
    node scripts/compose-temple-slogan.js [inputPath] [outputPath]

  Defaults:
    inputPath  = resources/brand-assets/temple_original.(jpg|png) (first that exists)
    outputPath = resources/brand-assets/temple_with_slogan.png
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const assetsDir = path.join(projectRoot, 'resources', 'brand-assets');

    // Resolve input
    let inputPath = process.argv[2];
    if (!inputPath) {
      const cand = [
        path.join(assetsDir, 'temple_original.jpg'),
        path.join(assetsDir, 'temple_original.jpeg'),
        path.join(assetsDir, 'temple_original.png')
      ];
      inputPath = cand.find(p => fs.existsSync(p));
    } else {
      inputPath = path.isAbsolute(inputPath) ? inputPath : path.join(projectRoot, inputPath);
    }

    if (!inputPath || !fs.existsSync(inputPath)) {
      console.error('[compose] Input image not found. Place your photo at:');
      console.error('  resources/brand-assets/temple_original.jpg  (or .png)');
      console.error('Or pass a path:');
      console.error('  node scripts/compose-temple-slogan.js path/to/your_photo.jpg');
      process.exit(1);
    }

    // Resolve output
    let outputPath = process.argv[3];
    outputPath = outputPath
      ? (path.isAbsolute(outputPath) ? outputPath : path.join(projectRoot, outputPath))
      : path.join(assetsDir, 'temple_with_slogan.png');

    // Read image size
    const meta = await sharp(inputPath).metadata();
    const width = meta.width || 1505;
    const height = meta.height || 768;

    // Positioning
    const yPct = 0.38; // ~38% down from the top (frieze band position)
    const overlayWidthPct = 0.98; // 98% of image width
    const overlayWidth = Math.round(width * overlayWidthPct);

    const fontSize = Math.round(width * 0.019); // scales with width (~29px at 1505)
    const centerX = Math.round(width / 2);
    const posY = Math.round(height * yPct);

    // SVG overlay with engraved-like effect (stroke + fill)
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.65"/>
          </filter>
        </defs>
        <g font-family="Cinzel, Georgia, 'Times New Roman', serif" font-weight="800" text-anchor="middle">
          <text x="${centerX}" y="${posY}" font-size="${fontSize}" letter-spacing="2" fill="#3a2e22" filter="url(#shadow)">
            PREMIUM INSTRUMENTS. SERVICE STANDARD.
          </text>
        </g>
      </svg>`;

    const svgBuffer = Buffer.from(svg);

    const out = await sharp(inputPath)
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .png()
      .toFile(outputPath);

    console.log(`[compose] Wrote: ${outputPath}`);
  } catch (err) {
    console.error('[compose] Failed:', err);
    process.exit(1);
  }
})();
