import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  useQuery({
    queryKey: ["events", { search: searchElement.current.value }],
    // 모든 이벤트가 아닌 검색어와 일치하는 이벤트만 가져움
    // 아래의 ref를 여기 또 쓰는 건 적절하지 않음, ref는 함수 다시 실행되도록 할 수 없음
    queryFn: () => fetchEvents(searchElement.current.value),
  });
  // input에 입력된 검색어가 fetchEvents에 전달돼야 함
  // 검색어가 없으면 쿼리 전송되지 않도록 해야 함

  // queryKey를 events로 하면 NewEventsSection의 쿼리 결과를 캐시 처리해서 다른 컴포넌트에서도 재사용
  // 올바른 방법이 아님, 모든 결과가 아니라 현재 검색중인 일부 결과만 필요함
  // 이 쿼리는 독립적으로 실행되고 NewEventsSection의 쿼리 결과는 이용하지 않아야 함

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      <p>Please enter a search term and to find events.</p>
    </section>
  );
}
