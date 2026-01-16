const fs = require('fs');
const path = require('path');

// Compute pages that need cleanup
const computePages = [
  'NetworksPage.tsx',
  'FlavorsPage.tsx',
  'KeyPairsPage.tsx',
  'RoutersPage.tsx',
  'PortsPage.tsx',
  'FloatingIPsPage.tsx',
  'SecurityGroupsPage.tsx',
  'ServerGroupsPage.tsx',
  'InstanceSnapshotsPage.tsx',
  'InstanceTemplatesPage.tsx',
  'ComputeImagesPage.tsx',
  'VolumeSnapshotsPage.tsx',
  'VolumeBackupsPage.tsx',
  'LoadBalancersPage.tsx',
  'CertificatesPage.tsx',
  'ComputeHomePage.tsx',
];

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function cleanupPage(filename) {
  const filepath = path.join(pagesDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`Skipping ${filename} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(filepath, 'utf8');
  const originalContent = content;
  
  // Remove sidebarOpen state
  content = content.replace(/const \[sidebarOpen, setSidebarOpen\] = useState\(true\);\n?/g, '');
  
  // Remove useTabs hook call and related code
  content = content.replace(/\/\/ Global tab management\n\s*const \{ tabs, activeTabId, closeTab, selectTab, openInNewTab, addNewTab, moveTab \} = useTabs\(\);\n?/g, '');
  content = content.replace(/const \{ tabs, activeTabId, closeTab, selectTab, openInNewTab, addNewTab, moveTab \} = useTabs\(\);\n?/g, '');
  content = content.replace(/const \{ tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab \} = useTabs\(\);\n?/g, '');
  
  // Remove handleOpenInNewTab function
  content = content.replace(/\/\/ Handle opening.*in new tab\n\s*const handleOpenInNewTab = \(.*\) => \{\n\s*openInNewTab\(.*\);\n\s*\};\n?/g, '');
  
  // Remove tabBarTabs conversion
  content = content.replace(/\/\/ Convert tabs to TabBar format\n\s*const tabBarTabs = tabs\.map\(\(tab\) => \(\{\n\s*id: tab\.id,\n\s*label: tab\.label,\n\s*closable: tab\.closable,\n\s*\}\)\);\n?/g, '');
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content);
    console.log(`Cleaned up state/hooks in ${filename}`);
  } else {
    console.log(`No state/hooks changes needed for ${filename}`);
  }
}

// Run cleanup
computePages.forEach(cleanupPage);
console.log('Done!');
