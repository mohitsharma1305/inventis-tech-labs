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

## Live deployment
Live application: https://inventis-production.up.railway.app
Railway deploys the `railway-real-data` branch with a connected PostgreSQL service. The original main branch remains unchanged.

Validation: 31 focused engine/API tests pass, including regression coverage for generic-word brand false positives. The frontend production build and dependency audit pass. Browser checks cover empty initial state, explicit API failure without fabricated output, and all four views at 390 pixels. Live database verification is tracked separately; local API tests simulate storage failure.

Brand matching uses explicit aliases with word boundaries. An unmatched configured official-domain list is a warning, not proof that a site is malicious. Saved reports retain the assessment made at submission time; resubmit input to apply updated detection rules.
