# Academic Pathway Recommendation Engine

An AI-assisted platform that recommends the optimal academic advancement pathway (Certification, DBA, PhD, Honorary Doctorate) based on a professional's qualifications, experience, and career goals.

### System Architecture Overview

The **Academic Pathway Recommendation Engine** follows a modern, decoupled monolithic structure built on a Serverless-first methodology using Next.js. The system’s architecture can be broken down into three main operational layers: the presentation layer, the calculation/data layer, and the AI reasoning layer.

```
+-----------------------------------------------------------------+
|                        Next.js Frontend                         |
|  (App Router Client Components: UserForm, SubmissionTable)     |
+--------------------------------+--------------------------------+
                                 |
                        HTTPS POST / GET
                                 |
+--------------------------------v--------------------------------+
|                   Next.js Route Handlers                        |
|   (/api/recommend, /api/submissions, /api/analytics)           |
+--------+-----------------------+-----------------------+--------+
         |                       |                       |
   Pure TS Functions      Supabase JS Client       Fetch API Call
         |                       |                       |
+--------v--------+   +----------v----------+   +--------v--------+
| Scoring Engine  |   |  Supabase Postgres  |   | AI LLM Gateway  |
| Normalization & |   |  (Persistence via   |   | Groq (Llama 3)  |
| Categorization  |   |   RLS Policies)     |   |   Fallback:     |
+-----------------+   +---------------------+   | OpenRouter      |
                                                | (Mistral 7B)    |
                                                +-----------------+


## Stack

- **Next.js 15** (App Router, TypeScript)
- **TailwindCSS** — dark, slate/amber design system
- **Supabase** — Postgres persistence
- **Groq / OpenRouter** — AI reasoning layer (with automatic fallback)

---

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd academic-pathway-engine
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** and run `supabase-migration.sql`
3. Copy your project URL and anon key

### 3. AI API keys

Get at least one:
- **Groq** (free tier): [console.groq.com](https://console.groq.com)
- **OpenRouter** (free models): [openrouter.ai](https://openrouter.ai)

### 4. Environment variables

```bash
cp .env.local.example .env.local
# Fill in your keys
```

### 5. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Assessment form + recommendation result |
| `/submissions` | Searchable, sortable, paginated admin table |
| `/analytics` | Aggregate stats cards |
| `/api/recommend` | POST — scoring + AI explanation + Supabase insert |
| `/api/submissions` | GET — paginated list with search/sort |
| `/api/analytics` | GET — aggregated metrics |

---

## Scoring Model

Points are accumulated across three weight categories:

**Qualification** → Certification, DBA, PhD, Honorary Doctorate  
**Experience (years)** → 0–2, 3–7, 8–15, 15+  
**Career Goal** → Leadership, Research, Skill Development, Recognition

Raw scores are normalised to 0–100 for the confidence display. The highest scorer becomes the primary recommendation; others are listed as alternatives.

---

## AI Explanation

The system tries Groq first (Llama 3 8B), then OpenRouter (Mistral 7B). If both fail, a deterministic fallback explanation is returned — the user always gets a result.

---

## Deployment

Deploy on [Vercel](https://vercel.com) (recommended for Next.js):

```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.
