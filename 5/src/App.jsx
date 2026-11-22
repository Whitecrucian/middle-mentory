import { useState } from "react";
import "./App.css";

const courses = [
  {
    id: "react",
    title: "React-интерфейсы с очень длинным названием для проверки переноса текста без поломки сетки и заголовка",
    category: "frontend",
    seats: 12,
    version: 1,
  },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function Panel({ title, children, actions }) {
  return (
    <section>
      <div>
        <h2>{title}</h2>
        {actions != null && actions !== false && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function App() {
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const visibleCourses =
    category === "all" ? courses : courses.filter((c) => c.category === category);

  function handleSelectCourse(id) {
    localStorage.setItem("selected-course", id);
    setSelectedId(id);
  }

  return (
    <main>

      <Panel
        title="Фильтр по категории"
        actions={
          category !== "all" ? (
            <button type="button" onClick={() => setCategory("all")}>
              Сбросить
            </button>
          ) : null
        }
      >
        <label>
          Категория:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Все</option>
            <option value="frontend">frontend</option>
            <option value="fullstack">fullstack</option>
            <option value="quality">quality</option>
          </select>
        </label>
      </Panel>

      <Panel title="Информационная панель без действий">
        <p>Выбранный курс: {selectedId ?? "не выбран"}</p>
      </Panel>

      <section>
        {visibleCourses.map((course) => (
          <Panel
            key={course.id}
            title={course.title}
            actions={
              <button type="button" onClick={() => handleSelectCourse(course.id)}>
                {selectedId === course.id ? "Выбрано" : "Выбрать"}
              </button>
            }
          >
            <p>Категория: {course.category}</p>
            <p>Свободных мест: {course.seats}</p>
          </Panel>
        ))}
      </section>
    </main>
  );
}