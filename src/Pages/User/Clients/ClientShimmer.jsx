import Card from "../../../Components/Card/Card";

function ClientShimmer() {
  return (
    <Card className="!p-0 overflow-hidden border border-color bg-[var(--background)] dark:bg-[var(--card-dark)]">
      {/* 🔥 IMAGE */}
      <div className="w-full h-56 md:h-64 shimmer" />

      {/* 🔥 CONTENT */}
      <div className="p-4 space-y-3">
        {/* Name + Plan */}
        <div className="flex justify-between">
          <div className="h-4 w-28 rounded shimmer"></div>
          <div className="h-4 w-16 rounded shimmer"></div>
        </div>

        {/* Mobile */}
        <div className="h-3 w-24 rounded shimmer"></div>

        {/* Date */}
        <div className="h-3 w-32 rounded shimmer"></div>

        {/* Expiry */}
        <div className="h-3 w-20 rounded shimmer"></div>

        {/* Payment */}
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded shimmer"></div>
          <div className="h-3 w-12 rounded shimmer"></div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[var(--border)]"></div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex border border-color rounded-md overflow-hidden">
            <div className="h-8 w-14 shimmer border-r border-color"></div>
            <div className="h-8 w-16 shimmer border-r border-color"></div>
            <div className="h-8 w-14 shimmer"></div>
          </div>

          <div className="flex gap-2">
            <div className="h-8 w-8 rounded shimmer"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ClientShimmer;
