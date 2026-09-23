#!/bin/bash
# Helper script showing which URLs to visit for each screenshot

cat << 'HELPER_EOF'
==============================================
 Screenshot Checklist for Thesis
==============================================

Create a folder: docs/screenshots/

Save each screenshot with the exact filename listed below.
Use Windows Snipping Tool (Win + Shift + S) or
Lightshot (https://app.prntscr.com/) for capture.

----------------------------------------------
 CHAPTER 3 FIGURES - System Design
----------------------------------------------

Figure 3.1 - Architecture Diagram
  Type: Diagram (create in draw.io)
  Save as: docs/screenshots/figure-3-1-architecture.png

Figure 3.2 - Use Case Diagram
  Type: Diagram (draw.io)
  Save as: docs/screenshots/figure-3-2-use-case.png

Figure 3.3 - Entity Relationship Diagram
  Type: Diagram (draw.io)
  Save as: docs/screenshots/figure-3-3-erd.png

Figure 3.4 - Data Flow Diagram
  Type: Diagram (draw.io)
  Save as: docs/screenshots/figure-3-4-dfd.png

----------------------------------------------
 CHAPTER 4 FIGURES - Screenshots
----------------------------------------------

Figure 4.1 - Home Page Hero
  URL: http://localhost:3000
  Save as: docs/screenshots/figure-4-1-home-hero.png

Figure 4.2 - Home Featured Laptops
  URL: http://localhost:3000 (scroll down)
  Save as: docs/screenshots/figure-4-2-home-featured.png

Figure 4.3 - Home Google Map
  URL: http://localhost:3000 (scroll to map)
  Save as: docs/screenshots/figure-4-3-home-map.png

Figure 4.4 - Auth Login Screen
  URL: http://localhost:3004/
  Save as: docs/screenshots/figure-4-4-auth-login.png

Figure 4.5 - Auth Register Screen
  URL: http://localhost:3004/register
  Save as: docs/screenshots/figure-4-5-auth-register.png

Figure 4.6 - Admin Login Screen
  URL: http://localhost:3004/admin-login
  Save as: docs/screenshots/figure-4-6-admin-login.png

Figure 4.7 - Customer Mode Selector
  URL: http://localhost:3001 (log in first)
  Save as: docs/screenshots/figure-4-7-customer-modes.png

Figure 4.8 - Customer Easy Mode
  URL: http://localhost:3001 (click Easy Mode)
  Save as: docs/screenshots/figure-4-8-easy-mode.png

Figure 4.9 - Customer Simple Mode
  URL: http://localhost:3001 (click Simple)
  Save as: docs/screenshots/figure-4-9-simple-mode.png

Figure 4.10 - Customer Pro Mode
  URL: http://localhost:3001 (click Pro)
  Save as: docs/screenshots/figure-4-10-pro-mode.png

Figure 4.11 - Customer Results
  URL: Submit any mode -> results
  Save as: docs/screenshots/figure-4-11-results.png

Figure 4.12 - WhatsApp Contact Button
  Zoom in on a result card's Contact button
  Save as: docs/screenshots/figure-4-12-whatsapp.png

Figure 4.13 - Vendor Inventory Tab
  URL: http://localhost:3002 (log in as vendor)
  Save as: docs/screenshots/figure-4-13-vendor-inventory.png

Figure 4.14 - Vendor Add Item Form
  URL: Click "+ Add Item" on vendor page
  Save as: docs/screenshots/figure-4-14-vendor-add-item.png

Figure 4.15 - Vendor Shops Tab
  URL: http://localhost:3002 (click Shops tab)
  Save as: docs/screenshots/figure-4-15-vendor-shops.png

Figure 4.16 - Admin Dashboard
  URL: http://localhost:3003 (log in as admin)
  Save as: docs/screenshots/figure-4-16-admin-dashboard.png

Figure 4.17 - Admin Vendor Table
  URL: http://localhost:3003 (scroll down)
  Save as: docs/screenshots/figure-4-17-admin-vendors.png

Figure 4.18 - Multi-Mode Comparison
  Side-by-side of Easy/Simple/Pro (compose in image editor)
  Save as: docs/screenshots/figure-4-18-modes-comparison.png

----------------------------------------------
 TERMINAL OUTPUT FIGURES
----------------------------------------------

Figure 4.19 - Docker Compose PS
  Command: docker-compose ps > docs/screenshots/figure-4-19-docker-ps.txt
  Or take a terminal screenshot

Figure 4.20 - ZAP Scan Results
  Command: cat results/zap/zap-summary.md
  Screenshot terminal output

Figure 4.21 - k6 Load Test
  Command: cat results/k6-summary.md
  Screenshot terminal output

Figure 4.22 - Integration Test Output
  Command: ./scripts/test-integration.sh
  Screenshot terminal output

----------------------------------------------
 HOW TO TAKE A SCREENSHOT ON WINDOWS
----------------------------------------------

Option 1: Windows Snipping Tool
  1. Press Win + Shift + S
  2. Select area to capture
  3. Paste into Paint, save as PNG
  4. Rename to match filename above

Option 2: Lightshot (recommended for repeated use)
  1. Install: https://app.prntscr.com/
  2. Press PrtScr
  3. Select area
  4. Save with proper name

Option 3: Browser built-in
  1. Chrome DevTools (F12)
  2. Ctrl + Shift + P
  3. Type "screenshot"
  4. Choose "Capture full size screenshot"

----------------------------------------------
 TIPS
----------------------------------------------

- Set browser zoom to 100% for consistency
- Hide browser bookmarks bar (Ctrl + Shift + B)
- Use a clean browser profile with no extensions
- Take screenshots at 1920x1080 resolution
- Ensure no sensitive info is visible
- For mobile screenshots: DevTools -> Toggle device -> iPhone 12 Pro

HELPER_EOF
