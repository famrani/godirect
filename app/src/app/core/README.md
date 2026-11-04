# Core
Application-wide singleton infrastructure only.

- auth: authentication/session infrastructure
- api: HTTP/API clients
- firebase: Firebase bootstrap/adapters
- media: media URL/storage infrastructure
- payments: payment infrastructure
- guards: route guards
- services: cross-domain application services

Asset-specific business logic belongs under `src/app/assets/<type>/`.
