---
name: add-component
description: "Adds an admin screen part to @volo-uti/volo-web-admin-ui: look it up in the index first, then follow the steps for files, exports, story, index and gate. Use when building a new admin part."
---

# Add a component

Replace `<category>` and `v-x`. The rules are in `AGENTS.md`.

1. Look in the index in `AGENTS.md` first, then in `@volo-uti/volo-web-ui` (`node_modules/@volo-uti/volo-web-ui/docs`). If nothing fits, say what you looked for, then add one. Add it here only when an admin screen alone needs it and it is built from `@volo-uti/volo-web-ui` parts; a general component belongs in `@volo-uti/volo-web-ui`.
2. Create `index.ts`, `v-x.tsx`, `v-x.types.ts` and `v-x.test.tsx` in `src/components/<category>/v-x/`. Give every export a JSDoc first sentence (at most 90 characters).
3. Add the export to the category `index.ts` and to `src/index.ts`.
4. Write the story in `stories/components/admin/v-x.stories.tsx`. Do not hand-write `argTypes`.
5. Use the `@volo-uti/volo-web-ui` component instead of a raw element (`<button>` and so on); lint blocks the raw ones in the stories.
6. Run `pnpm index` to regenerate the index and the package `docs/`.
7. Make `pnpm check` pass.
