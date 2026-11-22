import { useState } from "react";
import "./App.css";

const courses = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function CourseCard({ course, isSelected, onSelect }) {
  return (
    <article>
      <h3>{course.title}</h3>
      <p>Категория: {course.category}</p>
      <p>Свободных мест: {course.seats}</p>
      <button type="button" onClick={() => onSelect(course.id)}>
        {isSelected ? "Выбрано" : "Выбрать"}
      </button>
    </article>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [renderCount, setRenderCount] = useState(0);

  function handleSelectCourse(id) {
    localStorage.setItem("selected-course", id);
    setSelectedId(id);
  }

  return (
    <main>
      <h1>Каталог курсов</h1>

      <button type="button" onClick={() => setRenderCount((c) => c + 1)}>
        Повторить render ({renderCount})
      </button>

      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isSelected={selectedId === course.id}
          onSelect={handleSelectCourse}
        />
      ))}

      <p>Выбранный курс: {selectedId ?? "не выбран"}</p>
    </main>
  );
}

export default App;