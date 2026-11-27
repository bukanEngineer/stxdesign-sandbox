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
| Header refresh and "View All" | **Done** (fixed again, unreleased): `CardHeader` `actions` and `CardAsset` `actions`. 0.7.0 shipped the slot but the actions stacked under the title because of CSS rule order; the row layout now wins. |
| "My Assets" rows on a phone | **Done** (unreleased): `CardAsset platform="mobile"` (or `"auto"`) shows a chevron instead of Add / Send; `onSelect` makes each row a button. |
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

## Dashboard component requests (unreleased)

The shared pieces makegic's screens and templates rebuilt by hand now exist in the package:

| Request | Status |
| --- | --- |
| StatusTag | **Done**: `StatusTag`, plus `statusTone` and `statusLabel` maps. |
| KeyValueRows | **Done**: `KeyValueRows` (`inline`, `stacked`, `grid`; `copyable`, `info`, `emphasis`, `helper`). |
| ConfirmModal | **Done**: `ConfirmModal`, including async confirm and `confirmDisabled` for acknowledgements. |
| FilterBar | **Done** for search, single-choice filters, date range, clear, count and actions. Not built: `multiple` filters (use `MultiSelect` beside it), date-range presets and collapsing into a `BottomSheet` on phones (controls wrap instead). |
| Spinner and Skeleton (DSG-09) | **Done**. |
| Full-width buttons | **Done**: `Button fullWidth`. |
| StatCard | Not built: only planned pages need it so far. |

## Still open

- `Banner` and `Drawer` do not exist. Build them when a screen needs them. `Popover` exists.
- Not run-tested: Table truncation and hover, MultiSelect tag layout, Sidebar zones, Tooltip flipping.

## Hosted payment: DSG-11 status outcomes (0.7.0 baseline; fixed in source)

The [hosted payment app](https://github.com/bukanEngineer/hosted-onetime-payment/blob/HEAD/src/components/hosted-page.tsx#L833) already implements `OutcomeStatusIcon`: success uses the package `StatusIcon`; failed and expired use package `Icon` glyphs (`close` and `schedule`) inside local 36px solid circles. Their fills use `--status-critical` and `--status-warning-strong`. No new icon artwork is needed. The remaining gap is supported package variants and matching documentation, so the app can remove its local outcome shell.

Storybook distinction:

- `StatusIcon` stories and controls document only `success` and `needApproval`.
- `CardStatus` controls offer `warning` and `error`, but pass those values directly to `StatusIcon`, whose CSS has no matching fills. These control options do not demonstrate implemented warning/error outcomes.
- Unsupported variants also default to the `check` glyph and the accessible label “Success” unless overridden. Adding the missing variants must include correct default glyphs and accessible labels, and align `CardStatus` with the same supported variants.

Accurate gap wording: **StatusIcon lacks supported failed and expired outcome variants. CardStatus exposes warning/error control options in Storybook without matching StatusIcon implementation. The hosted app already supplies temporary outcome compositions using DS glyphs and tokens.**

Source review only; the hosted app and rendered Storybook were not run for this check. Awaiting/processing spinner and tinted-square presentation remain a separate app recipe (DSG-10).

DSG-11 is now implemented in source (unreleased): `StatusIcon` supports `error` and `warning`, and `CardStatus` uses the same variant type. Stories cover the variants, including an expired label example. After upgrading to the release containing this change, the hosted app can replace its local circles with `<StatusIcon variant="error" aria-label="Failed" />` and `<StatusIcon variant="warning" aria-label="Expired" />`. The historical 0.7.0 findings above still describe the installed app baseline.

## Hosted payment: DSG-06 and DSG-07 (unreleased)

- **DSG-06:** use `<Modal.Footer layout="responsive">` for a row above 480px and stacked, stretched actions at 480px or below. Use `layout="stacked"` to always stack. Buttons retain their natural height; no CSS specificity workaround or visual order reversal is needed. Put actions in the intended reading and keyboard order in JSX. The default `layout="row"` and Modal dismissal behavior are unchanged.
- **DSG-07:** Button, IconButton, LinkButton and SelectionBox gate hover styles behind `(hover: hover) and (pointer: fine)`. Active styles remain available independently of hover; LinkButton and SelectionBox now include pressed feedback. Disabled states and IconButton toggles remain protected. Consumers can remove corresponding local overrides after upgrading. Real-device Safari and hybrid mouse/touch checks remain outstanding.

Validation: focused unit and browser Storybook tests pass, including responsive footer sizing, DOM/keyboard order and dismissal. Additional Chromium checks cover mouse hover/press and emulated touch media with forced active CSS states; they do not establish physical-device tap behavior.

## Hosted payment: DSG-01 compact copy control (unreleased)

`<IconButton icon="content_copy" label="Copy address" size="xs" touchTarget onClick={copyAddress} />` provides a 24px visual, 16px glyph and 48×48px hit area. Omitting `touchTarget` keeps the hit area at the visual size. Existing `sm` / `lg` visual sizes are unchanged; expanded `sm` targets are also exactly 48×48px, including bordered variants.

The expanded target takes no layout space. Leave at least 48px between adjacent button centers in a shared column or row, and enough space from other interactive content to avoid overlap. The `CompactDetailList` Storybook example uses 56px row pitch, centered controls, 16px content gaps and 12px horizontal insets. Do not retain the app's 32px-high target override when adopting this recipe; adjust its summary rows to accommodate the larger area. Physical-phone usability still needs validation.

## Hosted payment: scope decisions

- **DSG-05 — skipped for the DS:** the hosted app should use existing title tokens for the relevant headings and total instead of overriding headline weight. No bold headline tokens are planned in this batch. Applying the title tokens is a separate hosted-app change.
- **DSG-10 — skipped for the DS:** transfer summaries, countdowns and awaiting/processing presentation remain app recipes. No shared payment-summary component is planned.
- **DSG-08 — QR scope simplified:** design examples only need a dummy QR. No additional QR renderer, PNG export API, signature API or token/network composition API is planned in this batch. This decision concerns design examples; it does not replace the existing runtime QR renderer or the hosted app's payment/export behavior. The missing BSC artwork alias is a separate asset-mapping issue.

Scope at the time of this decision: DSG-02 compact SelectionBox, DSG-03 16px Card padding, DSG-09 feedback primitives, and the BSC asset alias from DSG-08. Subsequent sections record the implemented items.

## Hosted payment: DSG-08 BSC mapping (unreleased)

The hosted app already uses `BscLogo` from `stxdesign-sandbox/logos`. `AssetMark` now maps `bsc` (case-insensitive) to that same bundled artwork, including in recipes that resolve artwork automatically. No new artwork dependency was added. After upgrading, hosted `NetworkMark` and `TokenWithNetwork` can use `<AssetMark asset="bsc" size={size} />` and remove their explicit BSC branches. Existing `BNB` and `BINANCE` mappings are unchanged.

## Hosted payment: DSG-02 compact selection and DSG-03 Card inset (unreleased)

- **DSG-02:** replace the app's SelectionBox padding, label font and text-gap overrides with `density="compact"`. This recipe uses 8px vertical / 12px horizontal padding, `--body-bold-medium` labels (Hanken 700 / 14px), unchanged `--body-medium` descriptions, a 0px label/description gap and the existing 8px control/content gap. It applies to radio and checkbox rows, with or without a description or leading radio icon. `density="default"` preserves existing presentation. Consumers no longer need internal `.selbox*` class overrides for this recipe.
- **DSG-03:** use `<Card padding="sm">` for the fixed 16px inset. Remove padding from the app's inner wrapper when adopting it, so the inset is applied once. Existing `padding="none"`, `md` (20px default) and `lg` (24px) remain available. This is a fixed spacing option, not a responsive breakpoint change.

Both features are implemented in source, pending release and hosted-app adoption.
