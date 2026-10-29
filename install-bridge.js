// install-bridge.js
// Script to install the After Effects MCP Bridge to the ScriptUI Panels folder
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES Modules replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect platform
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

// Possible After Effects installation paths (common locations)
const possiblePaths = isMac
  ? [
      '/Applications/Adobe After Effects 2026',
      '/Applications/Adobe After Effects 2025',
      '/Applications/Adobe After Effects 2024',
      '/Applications/Adobe After Effects 2023',
      '/Applications/Adobe After Effects 2022',
      '/Applications/Adobe After Effects 2021'
    ]
  : [
      'C:\\Program Files\\Adobe\\Adobe After Effects 2026',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2025',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2024',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2023',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2022',
      'C:\\Program Files\\Adobe\\Adobe After Effects 2021'
    ];

// Find valid After Effects installation
let afterEffectsPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    afterEffectsPath = testPath;
    break;
  }
}

if (!afterEffectsPath) {
  console.error('Error: Could not find After Effects installation.');
  console.error('Please manually copy the bridge script to your After Effects ScriptUI Panels folder.');
  console.error('Source: build/scripts/mcp-bridge-auto.jsx');
  if (isMac) {
    console.error('Target: /Applications/Adobe After Effects [VERSION]/Scripts/ScriptUI Panels/');
  } else {
    console.error('Target: C:\\Program Files\\Adobe\\Adobe After Effects [VERSION]\\Support Files\\Scripts\\ScriptUI Panels\\');
  }
  process.exit(1);
}

// Define source and destination paths
const sourceScript = path.join(__dirname, 'build', 'scripts', 'mcp-bridge-auto.jsx');
const destinationFolder = isMac
  ? path.join(afterEffectsPath, 'Scripts', 'ScriptUI Panels')
  : path.join(afterEffectsPath, 'Support Files', 'Scripts', 'ScriptUI Panels');
const destinationScript = path.join(destinationFolder, 'mcp-bridge-auto.jsx');

// Ensure source script exists
if (!fs.existsSync(sourceScript)) {
  console.error(`Error: Source script not found at ${sourceScript}`);
  console.error('Please run "npm run build" first to generate the script.');
  process.exit(1);
}

// Create destination folder if it doesn't exist
if (!fs.existsSync(destinationFolder)) {
  try {
    fs.mkdirSync(destinationFolder, { recursive: true });
  } catch (error) {
    console.error(`Error creating destination folder: ${error.message}`);
    console.error('You may need administrative privileges to install the script.');
    process.exit(1);
  }
}

// Copy the script
try {
  console.log(`Installing bridge script to ${destinationScript}...`);

  if (isMac) {
    // On Mac, try direct copy first, then sudo if needed
    try {
      fs.copyFileSync(sourceScript, destinationScript);
    } catch {
      // If direct copy fails, try with sudo
      execSync(`sudo cp "${sourceScript}" "${destinationScript}"`, { stdio: 'inherit' });
    }
  } else {
    // Try direct copy first
    let copied = false;
    try {
      fs.copyFileSync(sourceScript, destinationScript);
      copied = true;
    } catch {
      // Direct copy failed due to permissions, invoke elevated cmd
      const batPath = path.join(__dirname, 'copy_to_ae.bat');
      if (fs.existsSync(batPath)) {
        execSync(`powershell -Command "Start-Process cmd.exe -ArgumentList @('/c', 'call \\"${batPath}\\"') -Verb RunAs -Wait"`, { stdio: 'inherit' });
      } else {
        const escapedSource = sourceScript.replace(/'/g, "''");
        const escapedDest = destinationScript.replace(/'/g, "''");
        const psCommand = `Copy-Item -LiteralPath '${escapedSource}' -Destination '${escapedDest}' -Force`;
        execSync(`powershell -Command "Start-Process powershell -Verb RunAs -Wait -ArgumentList @('-NoProfile', '-Command', '${psCommand}')"`, { stdio: 'inherit' });
      }
    }
  }

  // Also copy to AppData Roaming as backup for current user
  if (isWindows) {
    const appData = process.env.APPDATA;
    if (appData) {
      const versions = ['26.3', '26.0', '25.3', '25.0', '23.4'];
      for (const v of versions) {
        const userPanelDir = path.join(appData, 'Adobe', 'After Effects', v, 'Scripts', 'ScriptUI Panels');
        try {
          if (!fs.existsSync(userPanelDir)) {
            fs.mkdirSync(userPanelDir, { recursive: true });
          }
          fs.copyFileSync(sourceScript, path.join(userPanelDir, 'mcp-bridge-auto.jsx'));
        } catch {
          // ignore
        }
      }
    }
  }

  console.log('Bridge script installed successfully!');
  console.log('\nImportant next steps:');
  console.log('1. Open After Effects');
  if (isMac) {
    console.log('2. Go to After Effects > Settings > Scripting & Expressions');
  } else {
    console.log('2. Go to Edit > Preferences > Scripting & Expressions');
  }
  console.log('3. Enable "Allow Scripts to Write Files and Access Network"');
  console.log('4. Restart After Effects (if it is currently running, to reload panels)');
  console.log('5. Open the bridge panel: Window > mcp-bridge-auto.jsx');
} catch (error) {
  console.error(`Error installing script: ${error.message}`);
  console.error('\nPlease try manual installation:');
  console.error(`1. Copy: ${sourceScript}`);
  console.error(`2. To: ${destinationScript}`);
  if (isMac) {
    console.error('3. You may need to run with sudo or copy manually via Finder');
  } else {
    console.error('3. You may need to run as administrator or use File Explorer with admin rights');
  }
  process.exit(1);
}
