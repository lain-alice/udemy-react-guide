import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    // 모든 이벤트가 아닌 검색어와 일치하는 이벤트만 가져움
    // 쿼리키가 검색결과 정보 포함, 이 정보는 동적으로 변해야 함, 검색어만 해당하니까

    // 아래의 ref를 여기 또 쓰는 건 적절하지 않음, ref는 상태와 달리 함수 다시 실행되도록 할 수 없음
    // 입력값이 변해도 이 쿼리는 업데이트, 재전송 x
    // 사용자가 다른 검색어 입력하면 새 데이터 가져오도록 하려면?
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    // 리액트 쿼리에서 실제로 리액트 쿼리에서 호출될 함수
    // searchTerm으로 fetchEvents, queryKey 동적 업데이트
    // fetchEvents 함수에 searchTerm이라 이름지은 프로퍼티가 담긴 객체 전달
  });
  // input에 입력된 검색어가 fetchEvents에 전달돼야 함
  // 검색어가 없으면 쿼리 전송되지 않도록 해야 함

  // queryKey를 events로 하면 리액트 쿼리는 NewEventsSection의 쿼리 결과를 캐시 처리해서 다른 컴포넌트에서도 재사용
  // 올바른 방법이 아님, 모든 결과가 아니라 현재 검색중인 일부 결과만 필요함
  // 이 쿼리는 독립적으로 실행되고 NewEventsSection의 쿼리 결과는 이용하지 않아야 함

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
    // 추천 이벤트 값은 폼까지 제출한 사람만
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An Error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
    // info가 undefined 아닐 때만 message 액세스
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
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
      {content}
    </section>
  );
}
