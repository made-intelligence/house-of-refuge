-- House of Refuge: applicants receive a copy of their application.
--
-- The confirmation email for a residential application now carries every
-- answer the applicant gave (see applicationSections in
-- functions/_shared/templates.ts). The trigger only forwards whitelisted
-- columns, so the whitelist is widened to the full set the public form writes.
--
-- The staff alert is unchanged: it still reads only the non-clinical fields it
-- always did. Clinical answers go to the applicant's own address, never to the
-- shared staff inbox.
--
-- Requires 20260810_email_notifications.sql (private.notify_submission).

drop trigger if exists notify_application_submitted on public.applications;
create trigger notify_application_submitted
  after insert on public.applications
  for each row execute function private.notify_submission(
    'application_submitted',
    'id,created_at,pathway,willingness_confirm,seeking_voluntarily,'
    'first_name,last_name,date_of_birth,gender,phone,email,address,state,occupation,marital_status,'
    'substance,substance_other,co_substances,duration,frequency,route_of_use,prev_treatment,'
    'medical_conditions,medications,mental_health,suicide_history,'
    'active_psychosis,antipsychotic_need,severe_cognitive,legal_detention,children_cohabitation,'
    'insight_level,motivation_source,treatment_goals,change_readiness,trigger_awareness,'
    'family_awareness,family_support,pfsp_name,pfsp_phone,sponsor_type,household_type,dependents,'
    'enablers_present,family_therapy_willing,housing_aftercare,'
    'prev_treatment_details,previous_recovery_length,primary_caregiver,caregiver_phone,caregiver_relationship,'
    'support_group_access,financial_stability,pfsp_relationship,family_consent_given,community_partner,church_connection,'
    'nok_name,nok_relationship,nok_phone,nok_email,nok_address,referral_source,referral_details,'
    'consent_admission,consent_detox,consent_confidentiality,consent_rights,consent_financial'
  );
