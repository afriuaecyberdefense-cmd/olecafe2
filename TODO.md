# TODO - Ole Cafe Admin (Image uploads that persist across phones)

- [x] Step 1: Install required dependencies (@vercel/blob and @vercel/kv)
- [x] Step 2: Add Vercel KV read/write layer for menu items (key: `olecafe:menuItems`)
- [x] Step 3: Add Vercel API route to upload images to Vercel Blob and persist returned `blob.url` into KV
- [x] Step 4: Update `AdminModal.tsx` to upload selected image via API and store returned public URL in menu state
- [x] Step 5: Update `useMenuItems.ts` to load menu items from KV on startup; fallback to `DEFAULT_MENU_ITEMS` when empty
- [x] Step 6: Update `menuData.ts` to keep defaults only (loading/persist handled by hook)
- [x] Step 7: Implement persistence actions: add/delete/update image should write the full menu items JSON to KV
- [ ] Step 8: Local test: run dev server, verify UI updates immediately
- [ ] Step 9: Deploy to Vercel with env vars, then test from another browser/device

# Deployment

- [ ] Ensure correct Vercel build config for Vite React in ./app
- [ ] Push whole app to GitHub and set Vercel project to repo `afriuaecyberdefense-cmd/olecafe2`
