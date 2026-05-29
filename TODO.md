# TODO - Ole Cafe

## Goal
Restore the full menu, add images for menu items, update prices as needed, and push changes to GitHub.

## Steps
1. Inspect current menu rendering and menu item source of truth (DEFAULT_MENU_ITEMS vs KV).
2. Ensure `app/src/data/menuData.ts` includes the correct full list of menu items (restore any missing items).
3. Populate `imageUrl` for each menu item using images from `app/public/imgaes`.
4. Ensure prices are correct for each menu item.
5. Commit and push changes to the branch `blackboxai/menu-images`.
6. If KV already has stored menu items, reset/overwrite it so the app loads the new defaults.
7. Run local build/dev to confirm images and menu show.

