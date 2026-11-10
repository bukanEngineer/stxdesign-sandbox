# Design-system gaps from dashboard screens

Status of each gap reported against stxdesign-sandbox 0.2.2, re-checked against the source in this repo. Gaps closed on the `feat/ds-gap-fixes` branch are marked **Done**; the version they ship in is the next release after 0.6.2.

## Home

| Gap | Status |
| --- | --- |
| White rounded surface behind sections | **Done** with `Card` `radius="lg"` and `padding="lg"`. No `Surface` component, because it would look like `Card`. The grey page background stays in the app shell (`var(--background)`). |
| Wallet toggle in the "My Assets" header | **Done**: `CardAsset` `toggle` slot. Use `Tabs` with `variant="secondary"` for the pill look. |
| "+3" network overflow | Already shipped: `CardAsset` passes `networkOverflow` to `ListAsset` above four networks. |
| Caption under action buttons | **Done**: `ActionButton` and `Caption`. |
| "Latest Transactions" rows with a toned amount | **Done**: `ActivityRow`. |
| Header refresh and "View All" | **Done**: `CardHeader` `actions` and `CardAsset` `actions`. |
| Footnote text | **Done**: `Footnote`. |
| Responsive reordering below 1280px | Still an app layout concern. |
| Typings mark `any` props required | Already fixed: props are optional in the 0.6.2 typings. |

## Transfer In

| Gap | Status |
| --- | --- |
| QR code with a chain logo | **Done**: `QR` `logo`. `QR` also now renders locally. It used to send the value to `api.qrserver.com`, which is not acceptable for deposit addresses. |
| Links inside Important Notes | Already possible: `CardSummary` `note.body` and `ImportantNotes` children accept any inline node (`LinkButton`, `<a>`). |
| Fee helper under Transfer Fee | **Done**: `CardSummary` item `helper`. |

## Spacing

| Gap | Status |
| --- | --- |
| 32px page rhythm | **Done**: `--space-8` and `spacing.section`. In the dashboard repo, add 32 to the allowed steps in `ds-guard` (`SHARED_MODULE_SPACING_STEPS`) once this ships. |

## Component guides vs the package

| Component | Guide says | Status |
| --- | --- | --- |
| Button | Left and right icon | **Done**: `startIcon`, `endIcon`. Also new: `destructive` variant. |
| IconButton | Active state | **Done**: `pressed`. Also new: `destructive` variant. |
| Alert | Sticky Critical | **Done**: `sticky`. Tones are `positive`, `critical`, `warning`, `info`, `neutral`. |
| Tag | Static filled | No change needed: outlined tones already have tinted surfaces, and `new` is solid brand. |
| Tooltip | Flip, Dismiss, action variant | Tooltips are plain and non-interactive by design; use `Popover` for actions. Positioning props (`side`, `collisionPadding`) are exposed. |
| BottomSheet | Search, swipe | Swipe is built in. Search is `BottomSheetSelect` `searchable`. Mobile-only was removed on purpose in 0.6.0. |
| Select | Logo and secondary text on options | `Select.Item` takes any children, so compose them. |
| Input with button | Prefix panel (dial code) | **Done**: `prefixPanel`. |
| Input prefix or suffix | Part of Input | Lives in `InputCurrency` (`position`). |
| PageTitle | Back button, inline icon | **Done**: `onBack`, `backLabel`, `icon`. |
| TopNavigation | Visible items with "More" | **Done**: `items`, `maxVisibleItems`, `moreLabel`. |
| Pagination | Items per page | **Done**: `pageSizeOptions`, `onPageSizeChange`. |
| Coachmark | Start, centre, end alignment | **Done**: `align`. |
| Upload | Single file; size and type | Already has `multiple`, `accept`, `maxSize`. |

Naming: the guides say Success, Information and Toggle. The package uses `positive`, `info` and `Switch`. Update the guides, not the package.

## Still open

- `Banner` and `Drawer` do not exist. Build them when a screen needs them. `Popover` exists.
- Not run-tested: Table truncation and hover, MultiSelect tag layout, Sidebar zones, Tooltip flipping.
