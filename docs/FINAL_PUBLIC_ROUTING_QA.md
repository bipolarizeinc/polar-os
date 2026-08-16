# Final Public Routing QA

This patch removes public Founder Control exposure from the homepage and makes every homepage division link resolve to its explicit server-rendered destination without depending on client-side compatibility rewriting.

- Non-Blueprint divisions route to their exact `/services#division` section.
- Blueprint routes directly into contextual P.O.L.A.R. intake.
- The Bipolarized Blueprint CTA carries division/service/source context.
- Founder Control remains a protected internal route but is no longer advertised from the public homepage.
