import { useRef, useState } from "react";
import "./App.css";

const courses = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function filterCourses(query) {
  const q = query.trim().toLowerCase();
  if (!q) return courses;
  return courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  );
}

export default function App() {
  const [controlledQuery, setControlledQuery] = useState("");

  function handleControlledReset() {
    setControlledQuery("");
  }


  const uncontrolledInputRef = useRef(null);
  const [appliedQuery, setAppliedQuery] = useState("");

  function handleApplyUncontrolled() {
    const value = uncontrolledInputRef.current ? uncontrolledInputRef.current.value : "";
    setAppliedQuery(value);
  }

  function handleUncontrolledReset() {
    if (uncontrolledInputRef.current) {
      uncontrolledInputRef.current.value = "";
    }
    setAppliedQuery("");
  }

  const controlledList = filterCourses(controlledQuery);
  const uncontrolledList = filterCourses(appliedQuery);

  return (
    <main>
      
      <section>
        <h2>Управляемый фильтр (value + onChange)</h2>
        <label>
          Поиск:
          <input
            type="text"
            value={controlledQuery}
            onChange={(e) => setControlledQuery(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleControlledReset}>
          Сбросить управляемый
        </button>
        <p>Текущий запрос: «{controlledQuery}»</p>
        <ul>
          {controlledList.map((course) => (
            <li key={course.id}>
              {course.title} ({course.category}, мест: {course.seats})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Неуправляемый фильтр (defaultValue + ref по кнопке)</h2>
        <label>
          Поиск:
          <input
            ref={uncontrolledInputRef}
            type="text"
            defaultValue=""
          />
        </label>
        <button type="button" onClick={handleApplyUncontrolled}>
          Применить (прочитать ref)
        </button>
        <button type="button" onClick={handleUncontrolledReset}>
          Сбросить неуправляемый
        </button>
        <p>Применённый по кнопке запрос: «{appliedQuery}»</p>
        <ul>
          {uncontrolledList.map((course) => (
            <li key={course.id}>
              {course.title} ({course.category}, мест: {course.seats})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}