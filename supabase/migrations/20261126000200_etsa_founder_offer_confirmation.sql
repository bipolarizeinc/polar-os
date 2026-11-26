alter table public.etsa_candidate_referrals
  add column founder_offer_confirmed_at timestamptz,
  add column founder_offer_invoice_reference text,
  add constraint etsa_founder_offer_fields check (
    (founder_offer_confirmed_at is null or kind = 'founder')
    and (
      founder_offer_invoice_reference is null
      or (
        kind = 'founder' and founder_offer_confirmed_at is not null
        and founder_offer_invoice_reference ~ '^in_[A-Za-z0-9]{8,100}$'
      )
    )
  );

create unique index etsa_founder_offer_unique_invoice
  on public.etsa_candidate_referrals (founder_offer_invoice_reference)
  where founder_offer_invoice_reference is not null;
