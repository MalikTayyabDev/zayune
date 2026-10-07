import { MarketingBroadcastForm } from "@/components/admin/MarketingBroadcastForm";

export const metadata = {
  title: "Marketing · Admin",
};

export default function AdminMarketingPage() {
  return (
    <div>
      <p className="text-nav text-brass">Broadcast</p>
      <h1 className="mt-2 font-display text-3xl text-aubergine">
        Email marketing
      </h1>
      <p className="mt-3 max-w-lg text-sm text-aubergine/65">
        Send a studio update to newsletter subscribers, registered customers, or
        both. Uses the same branded ZAYUNE template as transactional mail.
      </p>
      <div className="mt-10">
        <MarketingBroadcastForm />
      </div>
    </div>
  );
}
