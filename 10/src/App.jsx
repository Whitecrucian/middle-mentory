import { memo, useCallback, useMemo, useState } from "react";
import "./App.css";

const courses = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

const CoursePicker = memo(function CoursePicker({ label, course, options, onSelect }) {
  console.log("[render CoursePicker]", label, {
    courseId: course.id,
    optionsRefChanged: "см. лог родителя",
  });

  return (
    <div>
      <span>
        {label}: <strong>{course.title}</strong> (maxSeats: {options.maxSeats})
      </span>
      <button type="button" onClick={() => onSelect(course.id)}>
        Добавить/выбрать
      </button>
    </div>
  );
});

export default function App() {
  const [count, setCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [useStableCallback, setUseStableCallback] = useState(true);
  const [unstableOptionsPerRender, setUnstableOptionsPerRender] = useState(true);

  function handleSelectUnstable(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

 
  const handleSelectStable = useCallback((id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const activeOnSelect = useStableCallback ? handleSelectStable : handleSelectUnstable;

  const memoOptions = useMemo(() => ({ maxSeats: 20 }), []);

  const freshOptions = { maxSeats: 20 };
  const activeOptions = unstableOptionsPerRender ? freshOptions : memoOptions;

  return (
    <main>

      <div>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Несвязанный счётчик: {count}
        </button>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={useStableCallback}
            onChange={(e) => setUseStableCallback(e.target.checked)}
          />
          Использовать useCallback для onSelect
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={unstableOptionsPerRender}
            onChange={(e) => setUnstableOptionsPerRender(e.target.checked)}
          />
          Создавать новый объект options на каждом render (иначе memoOptions)
        </label>
      </div>

      <p>Выбранные id: {selectedIds.length > 0 ? selectedIds.join(", ") : "пока пусто"}</p>

      {courses.map((course) => (
        <CoursePicker
          key={course.id}
          label={course.id}
          course={course}
          options={activeOptions}
          onSelect={activeOnSelect}
        />
      ))}
    </main>
  );
}