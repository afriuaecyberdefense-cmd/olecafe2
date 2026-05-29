# TODO

- [x] Fix Manage-tab image updates to store Vercel Blob public URL (not base64) in `AdminModal.tsx`.
- [x] Debug why items/images vanish after refresh on Vercel.
  - [x] Add logging / error reporting to `/api/menu/items` PUT/GET (KV) so we can see if KV writes are failing.
  - [x] Stop swallowing persistence errors in `useMenuItems` so UI shows the failure.
  - [ ] Verify required env vars for `@vercel/kv` are present in Vercel.


