# Component States

Setiap interactive component mempunyai:

- default
- hover (pointer)
- active/pressed
- focus-visible
- disabled
- loading
- success bila relevan
- error/invalid bila relevan

## Data component

List, table, card, chart, dan timeline juga mempunyai:

- loading/skeleton
- empty
- partial data
- stale data
- error
- retry
- no permission

## State rule

Disabled action harus menjelaskan alasan melalui helper text atau tooltip yang dapat diakses. Jangan memakai disabled ketika user sebenarnya perlu memperbaiki input; biarkan action aktif dan tampilkan validation yang jelas sesuai kebutuhan flow.
