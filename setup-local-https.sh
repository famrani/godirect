#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
command -v mkcert >/dev/null || { echo 'Install mkcert first: brew install mkcert' >&2; exit 1; }
umask 077
mkdir -p secrets/tls
mkcert -install
if [[ -f secrets/tls/cert.pem && -f secrets/tls/key.pem ]]; then
  echo 'Existing local certificate retained.'
elif [[ -e secrets/tls/cert.pem || -e secrets/tls/key.pem ]]; then
  echo 'Incomplete certificate pair in secrets/tls. Restore the matching files before retrying.' >&2
  exit 1
else
  mkcert -cert-file secrets/tls/cert.pem -key-file secrets/tls/key.pem localhost 127.0.0.1 ::1
fi
# Copy only the PUBLIC trust certificate. Never copy rootCA-key.pem.
cp "$(mkcert -CAROOT)/rootCA.pem" secrets/tls/rootCA.pem
# Mount individual files read-only so the unprivileged node user can read them.
# Their host directory remains private (700) and is excluded from Git/builds.
chmod 700 secrets/tls
chmod 644 secrets/tls/cert.pem secrets/tls/key.pem secrets/tls/rootCA.pem
openssl verify -CAfile secrets/tls/rootCA.pem secrets/tls/cert.pem
echo 'Local HTTPS certificate ready. Start with compose.yaml + compose.https.yaml.'
