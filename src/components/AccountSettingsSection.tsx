"use client";

import { useEffect, useState } from "react";
import { AccountInformationSection } from "@/components/AccountInformationSection";
import { HoaAuthPortal } from "@/components/HoaAuthPortal";
import {
  fetchHomeownerAccount,
  type HomeownerAccount,
} from "@/lib/knack-session";

const ACCOUNT_PROFILES = ["profile_5"];

export function AccountSettingsSection() {
  return (
    <HoaAuthPortal
      requireGoodStanding={false}
      allowedProfiles={ACCOUNT_PROFILES}
      description="Enter the email and password for your HOA portal account to update your contact details and login settings."
      load={fetchHomeownerAccount}
    >
      {(data) => <AccountSettingsDashboard account={data} />}
    </HoaAuthPortal>
  );
}

function AccountSettingsDashboard({
  account: initialAccount,
}: {
  account: HomeownerAccount;
}) {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    setAccount(initialAccount);
  }, [initialAccount]);

  return (
    <AccountInformationSection
      account={account}
      onAccountChange={setAccount}
      description="Keep your contact details and login email current so the HOA can reach you and you can access member pages."
    />
  );
}
