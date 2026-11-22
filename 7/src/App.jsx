import { useState } from "react";
import "./App.css";

const coursesData = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function CourseListView({ items, emptyText = "Курсы не найдены", onSelect }) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul>
      {items.map((course) => (
        <li key={course.id}>
          <strong>{course.title}</strong> — {course.category}, мест: {course.seats} (v{course.version}){" "}
          <button type="button" onClick={() => onSelect?.(course.id)}>
            Выбрать
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(() => localStorage.getItem("selected-course"));

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCourses = normalizedQuery
    ? coursesData.filter(
        (course) =>
          course.title.toLowerCase().includes(normalizedQuery) ||
          course.category.toLowerCase().includes(normalizedQuery)
      )
    : coursesData;

  function handleSelectCourse(id) {
    localStorage.setItem("selected-course", id);
    setSelectedId(id);
  }

  return (
    <main>
      
      <section>
        <h2>Интерактивный каталог (контейнер + представление)</h2>
        <label>
          Поиск:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название или категория"
          />
        </label>
        <p>Выбранный курс: {selectedId ?? "не выбран"}</p>

        <CourseListView
          items={filteredCourses}
          emptyText="По вашему запросу курсов нет"
          onSelect={handleSelectCourse}
        />
      </section>

      <hr />

      <section>
        <h2>Демонстрация представления: полный список</h2>
        <CourseListView
          items={coursesData}
          emptyText="Список пуст"
          onSelect={handleSelectCourse}
        />
      </section>

      <section>
        <h2>Демонстрация представления: пустой массив</h2>
        <CourseListView
          items={[]}
          emptyText="Список курсов пока пуст (передан пустой массив)"
          onSelect={handleSelectCourse}
        />
      </section>
    </main>
  );
}