# Stripe Connect multi-owner implementation

The release uses Connect Standard accounts and direct charges. Checkout
Sessions are created with the connected owner's OAuth access token.
`application_fee_amount` transfers the configured platform commission to the
platform account.

The backend never trusts `ownerId` supplied by the browser for a booking
payment. It resolves the booking, then the boat, then the owner from Firebase.
The resolved values and fee calculation are copied into the Checkout metadata,
`backendpayments`, and the booking's `connectFinancials` node.

Commission priority:

1. `backendowners/{ownerId}/connect/commissionBps`
2. `backendowners/{ownerId}/commissionBps`
3. `platformSettings/stripeConnect/defaultCommissionBps`

Alegria/platform and non-commissionable types such as skipper payments receive
an application fee of zero.

Do not expose `stripeStandard/access_token`, refresh tokens or webhook secrets
through frontend-readable Firebase rules.
