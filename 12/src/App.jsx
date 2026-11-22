import { useState } from "react";
import "./App.css";

const coursesData = [
  { id: "react", title: "React-интерфейсы", category: "frontend", seats: 12, version: 1 },
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

function FilterBar({ query, onQueryChange, category, onCategoryChange, onResetSearch }) {
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

      <button type="button" onClick={onResetSearch}>
        Очистить поиск и фильтр
      </button>
    </div>
  );
}

function SelectedCourseBox({ selectedCourse, isVisibleInFiltered, onClearSelection }) {
  if (!selectedCourse) {
    return <p>Выбранный курс: не выбран</p>;
  }

  return (
    <div>
      <p>
        <strong>Выбранный курс:</strong> {selectedCourse.title} ({selectedCourse.category}, мест:{" "}
        {selectedCourse.seats}, v{selectedCourse.version})
      </p>
      {!isVisibleInFiltered && (
        <p>
          Курс скрыт текущим фильтром, но карточка выбранного курса сохраняется отдельно.
        </p>
      )}
      <button type="button" onClick={onClearSelection}>
        Снять выбор
      </button>
    </div>
  );
}

function FavoritesBox({ favoriteCourses, onToggleFavorite, onClearFavorites }) {
  return (
    <div>
      <p>Избранных курсов: {favoriteCourses.length}</p>
      <button type="button" onClick={onClearFavorites} disabled={favoriteCourses.length === 0}>
        Очистить избранное
      </button>
      {favoriteCourses.length === 0 ? (
        <p>Список избранного пуст.</p>
      ) : (
        <ul>
          {favoriteCourses.map((course) => (
            <li key={course.id}>
              {course.title}{" "}
              <button type="button" onClick={() => onToggleFavorite(course.id)}>
                Убрать
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CatalogList({ coursesList, selectedId, favoriteIds, onSelect, onToggleFavorite }) {
  if (coursesList.length === 0) {
    return <p>Подходящих курсов нет.</p>;
  }

  return (
    <ul>
      {coursesList.map((course) => {
        const isSelected = course.id === selectedId;
        const isFavorite = favoriteIds.includes(course.id);

        return (
          <li key={course.id}>
            <strong>{course.title}</strong> — {course.category}, мест: {course.seats} (v{course.version}){" "}
            <button type="button" onClick={() => onSelect(course.id)}>
              {isSelected ? "Выбрано" : "Выбрать"}
            </button>{" "}
            <button type="button" onClick={() => onToggleFavorite(course.id)}>
              {isFavorite ? "В избранном" : "В избранное"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [userNote, setUserNote] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory = category === "all" || course.category === category;
    const matchesQuery =
      !normalizedQuery || course.title.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const filteredCount = filteredCourses.length;
  const favoriteCount = favoriteIds.length;
  const selectedCourse =
    selectedId != null ? coursesData.find((course) => course.id === selectedId) ?? null : null;
  const isSelectedVisible =
    selectedCourse != null && filteredCourses.some((course) => course.id === selectedCourse.id);
  const favoriteCourses = coursesData.filter((course) => favoriteIds.includes(course.id));

  function handleSelectCourse(id) {
    setSelectedId(id);
  }

  function handleToggleFavorite(id) {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleResetSearchAndFilter() {
    setQuery("");
    setCategory("all");
  }

  function handleClearFavorites() {
    setFavoriteIds([]);
  }

  return (
    <main>

      <Panel title="Поиск и фильтр">
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          onResetSearch={handleResetSearchAndFilter}
        />
        <p>
          Найдено в списке: {filteredCount} из {coursesData.length} | В избранном: {favoriteCount}
        </p>
      </Panel>

      <Panel title="Выбранный курс">
        <SelectedCourseBox
          selectedCourse={selectedCourse}
          isVisibleInFiltered={isSelectedVisible}
          onClearSelection={() => setSelectedId(null)}
        />
      </Panel>

      <Panel title="Избранное">
        <FavoritesBox
          favoriteCourses={favoriteCourses}
          onToggleFavorite={handleToggleFavorite}
          onClearFavorites={handleClearFavorites}
        />
      </Panel>

      <Panel title="Каталог">
        <CatalogList
          coursesList={filteredCourses}
          selectedId={selectedId}
          favoriteIds={favoriteIds}
          onSelect={handleSelectCourse}
          onToggleFavorite={handleToggleFavorite}
        />
      </Panel>

      <Panel title="Личная заметка (несвязанное значение)">
        <label>
          Заметка пользователя:
          <input
            type="text"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Не сбрасывается при очистке фильтров и избранного"
          />
        </label>
        <p>Текущая заметка: {userNote || "пусто"}</p>
      </Panel>
    </main>
  );
}