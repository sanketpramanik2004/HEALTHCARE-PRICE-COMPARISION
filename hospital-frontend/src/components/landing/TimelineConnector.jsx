export default function TimelineConnector() {
  return (
    <>
      <div className="hidden lg:block absolute left-0 right-0 top-[122px] h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      <div className="hidden lg:block absolute left-[8%] right-[8%] top-[84px] h-28 rounded-full border border-brand-100/80" />
      <div className="hidden lg:block absolute left-[18%] right-[18%] top-[240px] h-24 rounded-full border border-brand-100/70" />
      <div className="hidden lg:block absolute left-[28%] right-[28%] top-[396px] h-20 rounded-full border border-brand-100/60" />
      <div className="lg:hidden absolute bottom-0 left-[22px] top-0 w-px bg-gradient-to-b from-brand-200 via-emerald-200 to-transparent" />
    </>
  );
}
