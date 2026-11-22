import { useMemo, useState } from "react";
import "./App.css";

const coursesBase = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function createLargeCatalog(baseList, totalCount = 2000) {
  return Array.from({ length: totalCount }, (_, index) => {
    const template = baseList[index % baseList.length];
    return {
      ...template,
      id: `${template.id}-${index + 1}`,
      seats: (template.seats + (index % 7)) % 25,
    };
  });
}

const largeCourses = createLargeCatalog(coursesBase, 2000);

function sortCourses(list, sortBy, direction) {
  const start = performance.now();
  const sorted = [...list].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "seats") {
      cmp = a.seats - b.seats;
    } else {
      cmp = a.title.localeCompare(b.title, "ru");
    }
    return direction === "asc" ? cmp : -cmp;
  });
  const durationMs = performance.now() - start;
  return { sorted, durationMs };
}

export default function App() {
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [direction, setDirection] = useState("asc");
  const [unrelatedCount, setUnrelatedCount] = useState(0);

  const memoizedResult = useMemo(() => {
    return sortCourses(largeCourses, sortBy, direction);
  }, [sortBy, direction]);

  const directResult = sortCourses(largeCourses, sortBy, direction);
  const activeResult = useMemoEnabled ? memoizedResult : directResult;

  return (
    <main>

      <div>
        <label>
          <input
            type="checkbox"
            checked={useMemoEnabled}
            onChange={(e) => setUseMemoEnabled(e.target.checked)}
          />
          Использовать useMemo
        </label>
      </div>

      <div>
        <label>
          Поле сортировки:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">title</option>
            <option value="seats">seats</option>
          </select>
        </label>

        <label>
          Направление:
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="asc">По возрастанию (asc)</option>
            <option value="desc">По убыванию (desc)</option>
          </select>
        </label>
      </div>

      <div>
        <button type="button" onClick={() => setUnrelatedCount((c) => c + 1)}>
          Несвязанный счётчик: {unrelatedCount}
        </button>
      </div>

      <p>
        Записей: {activeResult.sorted.length} | Последний вызов сортировки:{" "}
        {activeResult.durationMs.toFixed(2)} мс
      </p>
      <p>
        Порядок: {sortBy} ({direction})
      </p>

      <ul>
        {activeResult.sorted.slice(0, 15).map((course) => (
          <li key={course.id}>
            {course.id} — {course.title} (seats: {course.seats}, v{course.version})
          </li>
        ))}
      </ul>
    </main>
  );
}