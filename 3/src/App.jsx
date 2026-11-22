import { memo, useState, useTransition } from "react";
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
    <ul>
      {filtered.map((item) => (
        <CourseCard key={item.id} item={item} query={query} />
      ))}
    </ul>
  );
});

export default function App() {
  const [useTrans, setUseTrans] = useState(true);
  const [text, setText] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSelectCourse(id) {
    localStorage.setItem("selected-course", id);
    setSelectedId(id);
  }

  function handleChange(e) {
    const nextValue = e.target.value;
    setText(nextValue);

    if (useTrans) {
      startTransition(() => {
        setListQuery(nextValue);
      });
    } else {
      setListQuery(nextValue);
    }
  }

  function handleClear() {
    setText("");
    if (useTrans) {
      startTransition(() => {
        setListQuery("");
      });
    } else {
      setListQuery("");
    }
  }

  return (
    <main>

      <label>
        <input
          type="checkbox"
          checked={useTrans}
          onChange={(e) => setUseTrans(e.target.checked)}
        />
        Использовать useTransition
      </label>

      <div>
        <label>
          Поиск
          <input value={text} onChange={handleChange} />
        </label>
        <button type="button" onClick={handleClear}>
          Очистить
        </button>
      </div>

      {useTrans && isPending && <p>Обновление списка...</p>}
      <p>Активный запрос списка: «{listQuery}»</p>

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