# Design Token Contract

## Token categories

Color, typography, spacing, radius, shadow, motion, z-index, breakpoint, component size.

## Contract

- App boleh memakai semantic token.
- App tidak boleh hardcode warna brand berulang.
- Component variant memetakan ke semantic token.
- Dark/high-contrast theme future dapat mengganti token tanpa mengubah component API.
- Token naming tidak memuat page/feature name.

## Example

```css
:root {
  --space-4: 1rem;
  --radius-control: 0.75rem;
  --color-action-primary: ...;
  --motion-standard: 200ms;
}
```
