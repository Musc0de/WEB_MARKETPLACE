# Schema Identity dan Auth

## Tables

### `users`

```text
id
username_display
username_normalized UNIQUE
email_display
email_normalized UNIQUE
status
email_verified_at
created_at
updated_at
```

### `user_profiles`

```text
user_id PK/FK
full_name
phone
avatar_object_key
locale
timezone
```

### `password_credentials`

```text
user_id PK/FK
password_hash
password_changed_at
hash_version
```

### `sessions`

```text
id
user_id
session_token_hash UNIQUE
user_agent
ip_hash
last_seen_at
expires_at
revoked_at
created_at
```

### Token dan audit

- `email_verification_tokens`.
- `password_reset_tokens`.
- `account_activation_tokens`.
- `login_attempts` / `security_audit_logs`.
- `addresses`.

## Rules

- Raw password/token tidak disimpan.
- Token single-use memakai `used_at`.
- Email/username uniqueness berdasarkan normalized field.
- User deletion tidak boleh merusak snapshot order/invoice.
