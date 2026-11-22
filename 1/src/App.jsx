import { useEffect, useRef, useState } from "react";
import "./App.css";

function StaticChild({ title }) {
  console.log("[render] StaticChild, title =", title);

  const boxRef = useRef(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const observer = new MutationObserver((records) => {
      for (const r of records) {
        console.log("[DOM] изменение узла ребёнка:", r.type);
      }
    });

    observer.observe(el, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={boxRef}>
      <h2>{title}</h2>
      <p>Постоянный текст дочернего компонента.</p>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [titleToggle, setTitleToggle] = useState(false);
  const [showChild, setShowChild] = useState(true);

  const title = titleToggle ? "Новый заголовок" : "Исходный заголовок";

  return (
    <main>
      <h1>Счётчик: {count}</h1>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +1 к счётчику
      </button>
      <button type="button" onClick={() => setTitleToggle((t) => !t)}>
        Изменить title ребёнка
      </button>
      <button type="button" onClick={() => setShowChild((s) => !s)}>
        {showChild ? "Скрыть (размонтировать) ребёнка" : "Показать (смонтировать) ребёнка"}
      </button>

      {showChild && <StaticChild title={title} />}
    </main>
  );
}

export default App;