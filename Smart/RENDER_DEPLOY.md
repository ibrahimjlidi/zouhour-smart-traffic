Render deployment & debugging checklist

1) Service settings
- Runtime: set Node version to `18` or `20` (Render service -> Runtime -> Node Version).
- Start command: `npm --prefix Smart start` (or use your Procfile if you have one).

2) Environment variables (Render -> Service -> Environment)
- `MONGO_URI` = your Atlas URI (use `mongodb+srv://<USER>:<PASSWORD>@.../dbname?...`). URL-encode the password if it contains special chars.
- `ALLOWED_ORIGINS` = https://zouhour-smart-traffic.vercel.app
- `DEBUG_CORS` = true   # optional, enables server logs for incoming Origin headers
- `ALLOW_TLS_INSECURE` = false  # set to `true` only temporarily for debugging TLS cert issues
- `PORT` = 5000
- `JWT_SECRET` = (your secret)

3) Quick verification (Render shell / one-off command)
- Open the Render Shell for your service or run a one-off command and execute:

  npm --prefix Smart run testdb

- If that fails with TLS/SSL errors, run the relaxed test:

  npm --prefix Smart run testdb:relax

- Interpretation:
  - `testdb` OK: DB connection good; redeploy frontend and verify login.
  - `testdb` FAIL but `testdb:relax` OK: certificate validation issue (Node/OpenSSL mismatch or CA problem). Try:
    - Set service Node version to 18/20.
    - If still failing, leave `ALLOW_TLS_INSECURE=true` temporarily to restore service, then fix permanently by upgrading Node/OpenSSL or contacting Atlas support.
  - Both fail: check Atlas Network Access (add 0.0.0.0/0 temporarily) and ensure credentials/URI are correct.

4) CORS checks
- With `DEBUG_CORS=true`, inspect Render service logs for lines like:
  "CORS check — origin: <incoming-origin>"
- Confirm that the origin matches exactly an entry in `ALLOWED_ORIGINS`. If it differs (trailing slash, protocol, or subdomain), add the exact origin.

5) After fixes
- Remove `ALLOW_TLS_INSECURE` or set it to `false`.
- Set `DEBUG_CORS=false`.
- Redeploy and test the frontend on Vercel.

6) If you want, I can prepare a PR to replace the `ALLOWED_ORIGINS` example with your exact value and add a small health-check endpoint to validate DB connectivity from Vercel.

Commands summary (copy/paste):

# Run normal DB test
npm --prefix Smart run testdb

# Run relaxed TLS DB test (debug only)
npm --prefix Smart run testdb:relax

# Manual curl preflight test (replace backend domain)
curl -I -X OPTIONS 'https://zouhour-smart-traffic.onrender.com/api/utilisateurs/login' -H 'Origin: https://zouhour-smart-traffic.vercel.app' -H 'Access-Control-Request-Method: POST'
