import { useCallback, useState } from "react";
import "./App.css";

const courses = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
  { id: "typescript", title: "Типизация данных", category: "frontend", seats: 0, version: 1 },
  { id: "next", title: "Серверный rendering", category: "fullstack", seats: 8, version: 1 },
  { id: "testing", title: "Проверка поведения UI", category: "quality", seats: 5, version: 1 },
];

function useFavorites(initialIds = []) {
  const [ids, setIds] = useState(() => Array.from(new Set(initialIds)));

  const toggle = useCallback((id) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const clear = useCallback(() => {
    setIds([]);
  }, []);

  return { ids, toggle, clear };
}

function CourseList({ coursesList, favoriteIds, onToggle }) {
  return (
    <section>
      <h2>Список курсов</h2>
      <ul>
        {coursesList.map((course) => {
          const isFav = favoriteIds.includes(course.id);
          return (
            <li key={course.id}>
              <strong>{course.title}</strong> ({course.category}, мест: {course.seats}, v{course.version}){" "}
              <button type="button" onClick={() => onToggle(course.id)}>
                {isFav ? "Убрать из избранного" : "В избранное"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FavoritesPanel({ favoriteIds, allCourses, onToggle, onClear }) {
  const favoriteCourses = allCourses.filter((c) => favoriteIds.includes(c.id));

  return (
    <section>
      <h2>Избранное ({favoriteIds.length})</h2>
      <button type="button" onClick={onClear} disabled={favoriteIds.length === 0}>
        Очистить избранное
      </button>

      {favoriteCourses.length === 0 ? (
        <p>Избранных курсов пока нет.</p>
      ) : (
        <ul>
          {favoriteCourses.map((course) => (
            <li key={course.id}>
              {course.title}{" "}
              <button type="button" onClick={() => onToggle(course.id)}>
                Убрать
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function App() {
  const { ids, toggle, clear } = useFavorites();

  return (
    <main>

      <FavoritesPanel
        favoriteIds={ids}
        allCourses={courses}
        onToggle={toggle}
        onClear={clear}
      />
      <CourseList
        coursesList={courses}
        favoriteIds={ids}
        onToggle={toggle}
      />
    </main>
  );
}