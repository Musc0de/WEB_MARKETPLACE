# Shared UI Accessibility Contract

Setiap component shared wajib:

- mendukung `ref` dan focus management bila diperlukan
- mempunyai accessible name/description
- tidak menghilangkan focus outline
- mendukung keyboard
- tidak bergantung pada hover
- mengikuti reduced motion
- bekerja pada zoom 200%
- mempunyai contrast dan state non-color
- menyediakan test accessibility untuk behavior utama
