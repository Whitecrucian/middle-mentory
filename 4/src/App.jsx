import { memo, useDeferredValue, useState } from "react";
import "./App.css";

const courses = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

const items = Array.from({ length: 240 }, (_, i) => ({
  id: String(i),
  title: ["React", "CSS", "TypeScript"][i % 3] + " " + i,
}));

const CourseCard = memo(function CourseCard({ item, query }) {
  let checksum = item.id.length + query.length;
  for (let i = 0; i < 80000; i++) {
    checksum = (Math.imul(checksum, 31) + i) | 0;
  }
  return (
    <li>
      {item.title} — {checksum}
    </li>
  );
});

const Results = memo(function Results({ query }) {
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <p>Результаты для запроса: «{query}»</p>
      <ul>
        {filtered.map((item) => (
          <CourseCard key={item.id} item={item} query={query} />
        ))}
      </ul>
    </>
  );
});

export default function App() {
  const [useDeferred, setUseDeferred] = useState(true);
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const deferredText = useDeferredValue(text);
  const listQuery = useDeferred ? deferredText : text;
  const isStale = useDeferred && deferredText !== text;

  function handleSelectCourse(id) {
    localStorage.setItem("selected-course", id);
    setSelectedId(id);
  }

  return (
    <main>

      <label>
        <input
          type="checkbox"
          checked={useDeferred}
          onChange={(e) => setUseDeferred(e.target.checked)}
        />
        Режим useDeferredValue
      </label>

      <div>
        <label>
          Поиск
          <input value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <button type="button" onClick={() => setText("")}>
          Очистить
        </button>
      </div>

      <p>Ввод: «{text}»</p>
      {isStale && <p>Обновляем результаты</p>}

      <Results query={listQuery} />

      <section>
        <h2>Курсы</h2>
        {courses.map((course) => (
          <div key={course.id}>
            <span>
              {course.title} ({course.category}, мест: {course.seats})
            </span>
            <button type="button" onClick={() => handleSelectCourse(course.id)}>
              {selectedId === course.id ? "Выбрано" : "Выбрать"}
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}