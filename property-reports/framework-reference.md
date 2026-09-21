# RHS Property Report Framework — Reference
- Master spec: https://rhsjp1.github.io/property-reports/rhs_property_report_master_spec.md
- Gateway: 127.0.0.1:8011 (POST /site-dossier for live parcel analysis)
- Skills: rhs/property-site-dossier (site_dossier v3.2), rhs/rhs-property-dossier-engine
- Skill files: ~/.hermes/skills/rhs/property-site-dossier/, rhs/rhs-property-dossier-engine/
- Framework commit: rhsjp01/rhs-automation-gateway@4af4bc7
- GitHub IO push: Rhsjp1/Rhsjp1.github.io@1b59ac3
- All reports use the universal provenance + compliance contract (§8 checklist + N-compliance guardrails).
- Build date: 2026-08-11

---
## Core Production Infrastructure Stack (as of 2026-08-11)

- **Frontend & Hosting:** Next.js framework; automated deployment workflows via GitHub; deployed to Vercel for serverless hosting, edge routing, and optimized Next.js rendering. Local development/debug networks use Cloudflare quick tunnels.
- **Geospatial Database:** All data layers, parcel boundary mapping, and spatial indexing are managed within Supabase using the PostGIS extension for cloud geospatial database management and spatial query execution.
- **Automation Engines:** Background property ingestion, pipeline triggers, webhook distributions, and recurring operational tasks are fully orchestrated through self-hosted/cloud-based n8n automation workflows.
- **AI Pipelines & Execution:** Specialized language processing, text generation, and fast local inference tasks are routed through a zero-dependency Python microservice layer connected to the Hermes Terminal of NOUS, with optimized model configurations running on local Ollama instances.
- **Elevation & Boundary Processing:** Raw elevation data parsing uses public terrain APIs and downloadable point-cloud formats from the USGS 3D Elevation Program (Lidar Explorer Map) for boundary and site envelope verification.
- **State & Regional GIS Data:** Land-grid definitions, pipeline-sector mapping, county parcel records, zoning, and property registry data are pulled from regional public data sources, county assessor portals, and state-level GIS registries (e.g., NC, Randolph, Mecklenburg).
---
*Reference doc for RHS Property Reports framework (v1) — https://rhsjp1.github.io/property-reports/*
