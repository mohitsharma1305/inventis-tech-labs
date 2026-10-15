# Inventis — Team 26, Tech Labs
Real submitted-content analysis with React, FastAPI and PostgreSQL. No seeded history, preset scans, fabricated fallback reports, fixed dashboard metrics, or simulated sandbox responses.

## Scope
The pipeline combines linguistic rules, TF-IDF + Logistic Regression, lexical URL indicators and configured brand-domain checks. Every extracted link is assessed. The highest per-link score determines the category. The text classifier trains from 20 labelled rows in `backend/app/data/seed_corpus.json`. These training examples are model inputs, not user-facing demo data. No held-out accuracy claim is made.

Links are not visited. Live reputation and VM inspection are not implemented. Low detected risk never guarantees safety. Model failure returns an error instead of a fake probability.

## Production
Railway builds the root Dockerfile. Set DATABASE_URL using the Postgres service reference. FastAPI listens on PORT, serves the compiled frontend and API from one origin, and exposes /api/health. Startup creates the schema without seeding rows. PostgreSQL requires persistent storage.

## Local setup
Python 3.12 and Node 22 recommended. Install `pip install -r requirements.txt`, set DATABASE_URL to a PostgreSQL connection string, then run `python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000`. In frontend, run `npm ci` then `npm run dev`.

## Privacy
A random 256-bit bearer token in localStorage identifies each browser workspace. The server stores its SHA-256 hash and filters all case and metric queries by it. This is anonymous browser-local access, not account authentication or multi-device sync. Clearing storage loses access. Export first. Never submit real passwords or OTPs. Individual reports can be deleted.

## API
- GET /api/health
- POST /api/analyze: text, optional url, channel, UUID request_id
- GET /api/history: query, risk_level, channel, limit, offset
- GET /api/history/{id}
- DELETE /api/history/{id}
- GET /api/dashboard/stats

Case endpoints require X-Workspace-Token (64 lowercase hex characters). Request IDs deduplicate retries within a workspace. Full reports are restored without re-analysis.

## Tests
Use a separate PostgreSQL test database in DATABASE_URL, install pytest and httpx, then run `python -m pytest tests -q`. Tests create randomly scoped records and clean them up.

## Deployment handoff
The standard Dockerfile and railway.json are ready. The source has not yet been uploaded: the connected GitHub integration rejected writes. The existing main branch has not been changed. Connect this source to Railway after granting repository write/upload access. Set DATABASE_URL to the Railway Postgres reference. Never store the source bundle in environment variables.

Validation: 25 focused engine/API tests pass. The frontend production build and dependency audit pass. Database persistence has not been integration-tested against the provisioned Railway PostgreSQL instance because no application deployment is live yet. The API tests simulate storage failure to verify a 503 rather than fabricated output.

Browser checks passed for empty initial state, explicit API failure without fabricated reports/history/metrics, guide rendering, all four views at 390 pixels, and no uncaught browser errors. Full frontend dependency audit: zero reported vulnerabilities at verification time.
