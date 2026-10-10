import { memo } from "react"

export const HistoryList = memo(function HistoryList({
  cities,
}: {
  cities: string[];
}) {
  return (
    <div className="history">
      <h3>История поиска</h3>
      {cities.join(", ")}
    </div>
  );
});