# Epsilon Systems Website - Local Development

## 🚀 Quick Start Guide

### Method 1: Using Python (Recommended - Easiest)

#### Step 1: Open PowerShell
- Press `Windows Key + X`
- Select "Windows PowerShell" or "Terminal"
- Navigate to your project folder:
  ```powershell
  cd C:\Users\khann\Downloads\epsilonwebsite
  ```

#### Step 2: Check if Python is installed
```powershell
python --version
```
or
```powershell
python3 --version
```

#### Step 3: Start the Server

**Option A: Using the provided script**
```powershell
.\start-server.ps1
```

**Option B: Manual command**
```powershell
python -m http.server 8000
```
or if you have Python 3:
```powershell
python3 -m http.server 8000
```

#### Step 4: Open in Browser
- Open your web browser
- Navigate to: **http://localhost:8000**
- The website should load!

#### Step 5: Stop the Server
- Press `Ctrl + C` in PowerShell to stop the server

---

### Method 2: Using Node.js (If you have Node.js installed)

#### Step 1: Install http-server (one-time)
```powershell
npm install -g http-server
```

#### Step 2: Start the Server
```powershell
http-server -p 8000
```

#### Step 3: Open in Browser
- Navigate to: **http://localhost:8000**

---

### Method 3: Using PHP (If you have PHP installed)

```powershell
php -S localhost:8000
```

---

## 📋 Prerequisites

### Check if Python is installed:
```powershell
python --version
```

### If Python is NOT installed:

1. **Download Python:**
   - Visit: https://www.python.org/downloads/
   - Download Python 3.x for Windows
   - During installation, check "Add Python to PATH"

2. **Verify Installation:**
   ```powershell
   python --version
   ```

---

## 🎯 Complete Step-by-Step Instructions

### First Time Setup:

1. **Open PowerShell:**
   - Press `Win + X`
   - Click "Windows PowerShell" or "Terminal"

2. **Navigate to project folder:**
   ```powershell
   cd C:\Users\khann\Downloads\epsilonwebsite
   ```

3. **Verify you're in the right folder:**
   ```powershell
   dir
   ```
   You should see `index.html` and `assets` folder

4. **Start the server:**
   ```powershell
   python -m http.server 8000
   ```

5. **You should see:**
   ```
   Serving HTTP on :: port 8000 (http://[::]:8000/) ...
   ```

6. **Open browser and go to:**
   ```
   http://localhost:8000
   ```

7. **To stop the server:**
   - Press `Ctrl + C` in PowerShell

---

## 🔧 Troubleshooting

### Issue: "python is not recognized"
**Solution:** 
- Install Python from https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation
- Restart PowerShell after installation

### Issue: Port 8000 is already in use
**Solution:**
- Use a different port:
  ```powershell
  python -m http.server 8080
  ```
- Then access: `http://localhost:8080`

### Issue: Script execution is disabled
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Images not loading
**Solution:**
- Make sure all image files exist in `assets/img/` folder
- Check browser console (F12) for errors
- Verify file paths in HTML are correct

---

## 📁 Project Structure

```
epsilonwebsite/
├── index.html          (Main page)
├── assets/
│   ├── css/
│   │   └── styles.css  (All styles)
│   ├── js/
│   │   └── carousel.js (Carousel functionality)
│   └── img/            (All images)
├── start-server.ps1    (PowerShell startup script)
└── README.md           (This file)
```

---

## ✅ Verification Checklist

- [ ] Python is installed (`python --version` works)
- [ ] You're in the correct folder (`index.html` exists)
- [ ] Server is running (see "Serving HTTP" message)
- [ ] Browser opens `http://localhost:8000`
- [ ] Website loads correctly
- [ ] Images display properly
- [ ] Carousel works (auto-slides every 4 seconds)
- [ ] Navigation links work
- [ ] Service cards have hover effects

---

## 🎨 Features to Test

1. **Carousel:**
   - Auto-slides every 4 seconds
   - Click prev/next buttons
   - Click dots to jump to slide
   - Hover to pause auto-slide
   - Use arrow keys to navigate

2. **Responsive Design:**
   - Resize browser window
   - Test on mobile view (F12 > Toggle device toolbar)

3. **Hover Effects:**
   - Hover over service cards
   - Hover over navigation links
   - Hover over buttons

---

## 💡 Tips

- Keep PowerShell window open while testing
- Use `Ctrl + C` to stop server
- Use `Ctrl + R` in browser to refresh
- Check browser console (F12) for any errors
- Server runs until you stop it (Ctrl + C)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check that all files are in the correct folders
2. Verify Python is installed correctly
3. Make sure port 8000 is not used by another application
4. Check browser console for errors (F12)

---

**Happy Coding! 🚀**

