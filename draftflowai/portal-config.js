// Enable only after configuring a dedicated Supabase project and commercial host.
// A browser publishable key is intended for public use; NEVER add service_role,
// secret keys, database credentials, or customer records to the repository.
window.DRAFTFLOW_CONFIG = Object.freeze({
  supabaseUrl: "",
  publishableKey: "",
  allowedOrigin: "" // exact HTTPS origin of commercial host, no trailing slash
});
