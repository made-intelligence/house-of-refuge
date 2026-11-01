// House of Refuge — a residential application, as the applicant answered it.
//
// One definition of the form's sections, questions and answer wording, shared
// by the applicant's confirmation email (templates.ts) and the dashboard's
// full-application PDF (src/pages/dashboard/AdmissionDetail.jsx). Keep it free
// of imports so both Deno and Vite can load it.
//
// Coded select values are mapped back to the wording on the public form
// (src/pages/Waitlist.jsx); anything unmapped is shown as stored. Questions
// left blank are dropped by the renderers, so columns the form does not yet
// save simply do not appear.

type Row = Record<string, unknown>
export type Section = [string, Array<[string, string]>]

const LABELS: Record<string, Record<string, string>> = {
  pathway: { A: 'Pathway A: Family-Supported Admission', B: 'Pathway B: Community-Supported Admission' },
  willingness_confirm: {
    yes: 'Yes: client demonstrates voluntary willingness to engage',
    family_persuaded: 'Partially: family has persuaded the client, showing some willingness',
    no: 'No: client denies the problem or resists structured care',
  },
  suicide_history: { no: 'No', past: 'Yes, in the past', recent: 'Yes, within the last 3 months', current: 'Yes, currently' },
  insight_level: {
    denial: 'Denial', precontemplation: 'Pre-contemplation', contemplation: 'Contemplation',
    preparation: 'Preparation', action: 'Action',
  },
  change_readiness: {
    fully: 'Fully committed: understands and accepts 12 weeks', mostly: 'Mostly committed: some reservations',
    uncertain: 'Uncertain: needs more information', resistant: 'Resistant: does not want to stay 12 weeks',
  },
  trigger_awareness: {
    yes: 'Yes: can name specific people, places, feelings', some: 'Somewhat: vague awareness', no: 'No: no awareness of triggers',
  },
  family_awareness: {
    fully: 'Fully aware and supportive', aware_unsupportive: 'Aware but not supportive', partially: 'Partially aware',
    unaware: 'Family does not know', no_family: 'No family / Estranged',
  },
  family_support: {
    strong: 'Strong: active involvement expected', moderate: 'Moderate: willing but limited availability',
    weak: 'Weak: minimal engagement', none: 'None: no family support available', toxic: 'Toxic: family may be an enabler or trigger',
  },
  family_consent_given: { yes: 'Yes: consent documented', verbal: 'Verbal consent: written to follow', pending: 'Not yet: to be discussed' },
  sponsor_type: {
    self: 'Self-funding', community: 'Community / Church sponsorship', ngo: 'NGO funding', compassion: 'HOR Compassion Fund application',
  },
  household_type: {
    alone: 'Lives alone', spouse: 'Lives with spouse / partner', parents: 'Lives with parents', family: 'Lives with extended family',
    friends: 'Lives with friends / roommates', homeless: 'Homeless / No stable housing', institution: 'Currently in another institution',
  },
  enablers_present: {
    no: 'No known enablers', family: 'Yes: family members who enable use', friends: 'Yes: friends or associates who use',
    both: 'Yes: both family and friends', environment: 'Yes: neighbourhood / environment is high-risk',
  },
  family_therapy_willing: {
    yes: 'Yes: family is willing', patient_only: 'Patient only: family not willing', unknown: 'Not yet discussed', no_family: 'No family available',
  },
  housing_aftercare: {
    yes: 'Yes: safe, stable environment', conditional: 'Conditional: depends on behaviour',
    no: 'No: will need transitional housing', unknown: 'Unknown at this time',
  },
}

const YES_NO: Record<string, string> = { yes: 'Yes', no: 'No' }

function answer(r: Row, key: string): string {
  const v = r[key]
  if (v === null || v === undefined) return ''
  if (typeof v === 'boolean') return v ? 'Agreed' : 'Not agreed'
  const s = String(v).trim()
  return LABELS[key]?.[s] ?? s
}

function dateOnly(v: unknown): string {
  if (!v) return ''
  const d = new Date(String(v))
  return Number.isNaN(d.getTime())
    ? String(v)
    : d.toLocaleDateString('en-NG', { dateStyle: 'long', timeZone: 'Africa/Lagos' })
}

export function applicationSections(r: Row): Section[] {
  const a = (key: string) => answer(r, key)
  const yn = (key: string) => YES_NO[String(r[key] ?? '')] ?? a(key)
  const fullName = [r.first_name, r.last_name].filter(Boolean).join(' ').trim()
  return [
    ['Pathway and willingness', [
      ['Is the client voluntarily seeking treatment?', a('willingness_confirm')],
      ['Context about willingness', a('seeking_voluntarily')],
      ['Pathway', a('pathway')],
    ]],
    ['Patient information', [
      ['Name', fullName],
      ['Date of birth', dateOnly(r.date_of_birth)],
      ['Gender', a('gender')],
      ['Phone', a('phone')],
      ['Email', a('email')],
      ['Address', a('address')],
      ['State of residence', a('state')],
      ['Marital status', a('marital_status')],
      ['Occupation', a('occupation')],
    ]],
    ['Clinical history', [
      ['Primary substance of concern', a('substance')],
      ['Substance specified', a('substance_other')],
      ['Other substances used concurrently', a('co_substances')],
      ['Duration of use', a('duration')],
      ['Frequency of use', a('frequency')],
      ['Route of administration', a('route_of_use')],
      ['Previous treatment attempts', a('prev_treatment')],
      ['Details of previous treatment', a('prev_treatment_details')],
      ['Longest period of sobriety', a('previous_recovery_length')],
      ['Known medical conditions', a('medical_conditions')],
      ['Current medications', a('medications')],
      ['Mental health conditions', a('mental_health')],
      ['History of self-harm or suicidal ideation', a('suicide_history')],
    ]],
    ['Screening questions', [
      ['Active psychosis or drug-induced psychosis', yn('active_psychosis')],
      ['Requires initiation/titration of antipsychotic medication', yn('antipsychotic_need')],
      ['Severe cognitive impairment', yn('severe_cognitive')],
      ['Currently under court order or legal detention', yn('legal_detention')],
      ['Requires children or family to live on-site', yn('children_cohabitation')],
    ]],
    ['Insight and readiness', [
      ['Insight level (stage of change)', a('insight_level')],
      ['Primary motivation for seeking treatment', a('motivation_source')],
      ['Hopes for treatment', a('treatment_goals')],
      ['Readiness to commit to 12 weeks', a('change_readiness')],
      ['Can identify triggers', a('trigger_awareness')],
    ]],
    ['Support and family', [
      ['Is family aware of the addiction?', a('family_awareness')],
      ['Level of family support', a('family_support')],
      ['Primary family support person', a('pfsp_name')],
      ['Support person phone', a('pfsp_phone')],
      ['Support person relationship', a('pfsp_relationship')],
      ['Family consent for admission', a('family_consent_given')],
      ['Primary caregiver', a('primary_caregiver')],
      ['Caregiver phone', a('caregiver_phone')],
      ['Caregiver relationship', a('caregiver_relationship')],
      ['Funding / sponsorship type', a('sponsor_type')],
      ['Community or church partner', a('community_partner')],
      ['Church connection', a('church_connection')],
      ['Current household type', a('household_type')],
      ['Number of dependents', a('dependents')],
      ['Enablers in the environment', a('enablers_present')],
      ['Access to a support group', a('support_group_access')],
      ['Financial stability', a('financial_stability')],
      ['Willingness to participate in family therapy', a('family_therapy_willing')],
      ['Stable housing after discharge', a('housing_aftercare')],
    ]],
    ['Next of kin', [
      ['Name', a('nok_name')],
      ['Relationship', a('nok_relationship')],
      ['Phone', a('nok_phone')],
      ['Email', a('nok_email')],
      ['Address', a('nok_address')],
      ['How you heard about us', a('referral_source')],
      ['Referral details', a('referral_details')],
    ]],
    ['Consents', [
      ['Admission terms', a('consent_admission')],
      ['Medically supervised detox', a('consent_detox')],
      ['Confidentiality', a('consent_confidentiality')],
      ['Patient rights', a('consent_rights')],
      ['Financial terms', a('consent_financial')],
    ]],
  ]
}

/** Sections with their unanswered questions removed, and empty sections dropped. */
export function answeredSections(r: Row): Section[] {
  return applicationSections(r)
    .map(([title, rows]): Section => [title, rows.filter(([, v]) => v.trim() !== '')])
    .filter(([, rows]) => rows.length > 0)
}
