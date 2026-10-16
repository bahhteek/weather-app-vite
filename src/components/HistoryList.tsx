import { memo } from "react"

export const HistoryList = memo(function HistoryList({
  cities,
  removeHistory,
}: {
  cities: string[];
  removeHistory: () => void;
}) {
  return (
    <div className="history">
      <h3>История поиска</h3>
      {cities.join(", ")}
      <button onClick={removeHistory}>Удалить историю</button>
    </div>
  );
});