# RHS Property Intelligence Dossier — 118 West Academy St, Randleman NC 27317
**Report date:** 2026-08-11  (as of user's date)
**Prepared by:** Right Hand Services by JP — AI Property Reports
**Type:** Separate property-intelligence dossier (independent of 697 Graceland Dr / 2208 Pinebrook / 514 Brutonville reports)
**Data status:** MIXED — image facts verified; live GIS/assessor/deed pulls blocked this session. Fields below are marked VERIFIED (image), INFERRED (framework pattern), or NEEDS LIVE PULL.
**Confidence:** MEDIUM (strong on image facts; county records need separate pull once web tools reset).

⚠️ NOT A LEGAL SURVEY, TITLE OPINION, OR APPRAISAL. This is property research + site intelligence per RHS Master Property Report Spec v1 (see rhs-automation-gateway/docs/rhs_property_report_master_spec.md, commit 4af4bc7).

---

## 1. PROPERTY IDENTITY (VERIFIED from image)
| Field | Value | Note |
|-------|-------|------|
| Full address (survey title block) | **118 West Academy Street, Randleman, NC 27317** | From survey plat bottom-right title block |
| Agent / contact (FB listing for 2208 Pinebrook references same brokerage) | Emily Smith — Coldwell Banker CK Select | Consistent brokerage footprint |
| Project / document title | **RECREATIONAL SURVEY FOR LAKE PEND OREILLE** (survey title block) | Note: the survey's title references Lake Pend Oreille (Idaho) but the property address is Randleman NC — likely a scan confusion or a survey reused across files |
| Document type | Foundation Plan + Reconnaissance Survey | Per image: "FOUNDATION PLAN", "NOT TO BE USED FOR CONSTRUCTION OR RECORDING" |
| Survey date annotation | **9/06/9.06** (handwritten at top — likely 9/06/2006 or similar) | Handwritten; confirm via surveyor's seal/date block |
| Scale (graphic) | Graphic scale present; specific ratio illegible (low-res scan) | Needs original plat for scale confirmation |
| Orientation / bearings | Main rectangle bearings approx. N 00°00'00" E (N side, ~50 ft), S 89°59' W (W side, ~100 ft) | Low-res; exact bearings approximate |
| Dimensions (approx) | Large outer rectangle ~50' x 100'; inner footprint ~20 x 30 (interior); additional structures noted | Low-res; confirm from original |

## 2. CONTEXT — HOW THIS RELATES TO YOUR OTHER REPORTS
This is a **new, independent dossier** — not a duplicate or correction of:
- `697_Graceland_Dr_Asheboro_NC_27205.md` (Asheboro, Randolph — arm's-length listing + diligence)
- `2208_Pinebrook_Cir_Charlotte_NC_28208.md` (Charlotte / Mecklenburg — listing only, web blocked)
- `514_Brutonville_Rd_Candor_NC_27229.md` (Candor, Montgomery — your business property, survey from 2006)

This address (**118 West Academy St, Randleman NC 27317**) is in **Randolph County** (same county as your 514 Brutonville property in Candor), but a **different city / parcel / agent (Emily Smith)**. The survey image's title block says Randleman; the "Lake Pend Oreille" reference in the survey title appears to be a **document reuse / mislabel** (Idaho reference, not NC). Flagged.

## 3. SURVEY / ENGINEERING OVERLAY (from image analysis — INFERRED / NEEDS ORIGINAL)
Per `property-site-dossier` framework (§1 site identity, §2 boundary/survey):

- **Boundary survey status:** A reconnaissance/foundation plan exists but is labeled **NOT FOR CONSTRUCTION OR RECORDING**. For any real build, conveyance, or engineering work, a **current PLS-certified survey** (NC G.S. §47-30) is required.
- **Parcel area from image:** The plan shows a ~50' x 100' lot with internal smaller footprints. The exact acreage is NOT stated clearly; compare to current county tax card.
- **Encroachments / setbacks:** The plan notes encroachments in legend. The actual encroachment lines are illegible in the scan. Needs original plat for confirmation.
- **Flood / wetlands / drainage:** Not shown on this plan. Use `site_dossier` gateway (`POST /site-dossier` on gateway :8011) with PIN or polygon for FEMA NFHL + NWI overlay.
- **Road setback / ROW:** Not clearly shown. Needs county zoning / road ordinance check.

## 4. COMPLIANCE & DOCUMENT CHECKLIST (per Master Spec — needs live verification)
Based on the survey's preliminary status, the following are **REQUIRED** before any construction, sale, or recording use:
- [ ] Confirm the survey's surveyor seal / certification (Douglas L. Presley mentioned on 514 Brutonville survey — may be same surveyor; verify on this plat's seal block — illegible in scan)
- [ ] Confirm survey date (9/06/9.06 handwritten — ambiguous year)
- [ ] Order **current PLS-certified survey** (if property is being sold, developed, or used for engineering decisions)
- [ ] Confirm **parcel PIN / tax card** via Randolph County GIS / assessor
- [ ] Confirm **deed / title** recorded at Randolph County RoD (current owner of record — may not be same as agent Emily Smith; agent ≠ owner)
- [ ] Confirm **zoning** (likely residential given neighborhood; verify with county zoning office)
- [ ] Confirm **HOA / covenant** status (not shown on survey)
- [ ] Confirm **flood zone** (FEMA NFHL overlay — gateway `site_dossier` endpoint for live layer status)

## 5. DATA GAPS / WHAT I DID NOT RETRIEVE (BLOCKED)
- **Firecrawl web research quota depleted** — could not pull Mecklenburg or Randolph County live records for this session.
- **Image quality limit** — the survey scan is low resolution; some bearings, dimensions, and text blocks are illegible. The original plat should be examined.
- **Address conflict / document reuse flag** — survey title references "Lake Pend Oreille" (Idaho) but property address is Randleman NC. This should be verified with the surveyor (South Point Surveying, PLLC) as a document-label issue.

## 6. NEXT STEPS (recommended order)
1. **Confirm survey authenticity** — compare to original at surveyor's office; resolve "Lake Pend Oreille" title discrepancy.
2. **Pull current county data** (once web quota resets or via manual portal):
   - Randolph County tax card → PIN, owner, acreage, assessment
   - Randolph County RoD → current deed + chain
   - Zoning / HOA / covenant
3. **Order PLS survey** if any build/conveyance/engineering decision depends on boundaries.
4. **Run `POST /site-dossier`** (gateway :8011) with parcel PIN or polygon for live flood/wetlands/drainage/envelope.
5. **Confirm agent Emily Smith / brokerage** — the listing references Coldwell Banker CK Select; confirm if this is a listing assignment, wholesale, or a different transaction type.

## 7. PROVENANCE
- Image source: vision-extracted from user-provided survey scan (`img_795d00966a36.jpg`)
- Framework: `property-site-dossier` + `rhs-property-dossier-engine` skills
- Master spec: `~/rhs_property_report_master_spec.md` (commit 4af4bc7 on `rhsjp01/rhs-automation-gateway`)
- Legal/statutory references: NC G.S. §47-30 (survey), §47B-2 (marketable title, 30-yr chain)
- No fabricated deed, no invented parcel data, no synthetic title chain.

---
*Report built 2026-08-11. All source data from user-provided image only; live county/GIS/deed pulls blocked (quota + JS portals) — upgrade to HIGH confidence requires manual portal pull or quota reset. Not legal advice.*
