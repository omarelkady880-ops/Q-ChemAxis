# TODO: Transform Q-ChemAxis to Desktop App with Electron

- [x] Update `vite.config.js` to set dev server port to 3000
- [x] Create `main.js` for Electron main process
- [x] Update `package.json`: change "main" to "main.js", add "electron" script, add Electron Builder build config
- [x] Install electron-builder as dev dependency
- [x] Check/create assets/icon.ico if missing
- [x] Build frontend with `npm run build`
- [x] Build Electron app with `npx electron-builder --win --x64`
- [x] Test `npm run electron` in dev mode
- [x] Test built .exe
- [x] Ensure .gitignore excludes build artifacts
- [ ] Create desktop shortcut to .exe (manual step)
