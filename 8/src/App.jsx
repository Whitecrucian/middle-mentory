import { useState } from "react";
import "./App.css";

const coursesData = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function FilterPanel({ query, onQueryChange, category, onCategoryChange, onReset }) {
  return (
    <div>
      <label>
        Поиск по названию:
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Например, React"
        />
      </label>

      <label>
        Категория:
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Все</option>
          <option value="frontend">frontend</option>
          <option value="fullstack">fullstack</option>
          <option value="quality">quality</option>
        </select>
      </label>

      <button type="button" onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}

function CourseList({ courses, emptyText }) {
  if (courses.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          <strong>{course.title}</strong> — {course.category}, мест: {course.seats} (v{course.version})
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory = category === "all" || course.category === category;
    const matchesTitle =
      !normalizedQuery || course.title.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesTitle;
  });

  const matchesCount = filteredCourses.length;

  function handleResetFilters() {
    setQuery("");
    setCategory("all");
  }

  return (
    <main>

      <FilterPanel
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        onReset={handleResetFilters}
      />

      <p>Найдено совпадений: {matchesCount}</p>

      <CourseList
        courses={filteredCourses}
        emptyText="Совпадений нет — измените запрос или сбросьте фильтры."
      />
    </main>
  );
}