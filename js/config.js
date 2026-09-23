/* ============================================================
   JK VEGIES — Supabase connection settings
   1. Create a project at https://supabase.com
   2. Run sql/schema.sql once in the SQL Editor
   3. Paste your Project URL + anon key below (or set them on
      the in-app "Supabase Setup" page — footer link).
   4. In Supabase: Authentication > Sign In > enable Email OTP,
      and set a Gmail SMTP under Project Settings > Auth > SMTP
      so OTP mails come from your Gmail.
   ============================================================ */
window.JKV_CONFIG = {
  SUPABASE_URL: localStorage.getItem('jkv_sb_url') || "",
  SUPABASE_ANON_KEY: localStorage.getItem('jkv_sb_key') || ""
};
