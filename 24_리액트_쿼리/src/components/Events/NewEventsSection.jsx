import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    // useQuery가 반환한 객체에서 구조분해 할당으로 실제 응답 data 추출
    // 한 번에 되지 않음, isPending이 요청이 여전히 실행 중인지 알려줌
    // 꼭 데이터가 반환되는 거 아님, 에러 발생할 수 있음
    // isError가 true 되게 하려면 response 코드가 error 반환할 수 있어야
    // refetch 수동으로 호출해 클릭 시 다시 전송 가능
    queryKey: ["events"], // 여러 개 들어갈 수 있고 문자열 한정 아님
    // 모든 GET HTTP 요청에는 쿼리 키가 있다
    // 내부에서 요청된 데이터를 캐시함
    // 배열 형태의 키를 내부적으로 저장, 다시 사용할 때마다 배열 키 확인하고 재사용
    queryFn: fetchEvents,
    // 쿼리 함수, 요청 전송 시 실제로 실행할 코드 정의
    // 프로미스를 반환하는 함수여야 함

    // useEffect와 일반 fetch에서는 다른 페이지 갔다오면 새 요청으로 모든 데이터 refetch
    // 리액트쿼리 적용하니 다른 페이지 갔다와도, 인터넷 느려도 데이터 즉각 표시
    // 실제 요청 보면 다른 요청 있음
    // 리액트쿼리는 응답 데이터를 캐시 처리하고 다른 useQuery 실행되면 캐시된 데이터 재사용
    staleTime: 5000,
    // 캐시에 데이터가 있을 때 데이터 업데이트 해달라는 자체적 요청하기 전에 기다리는 시간
    // 0이면 항상 요청 보냄, 설정하면 기다렸다가 요청해서 불필요한 요청 절약
    // gcTime: 30000,
    // 가비지 컬렉션 시간, 데이터와 캐시를 얼마나 오래 보관할지
    // 기본값 5분, 정한 시간 지나고 페이지 이동하면 데이터 없어지고 다시 로딩됨

    // 데이터 보관 기간과 새 요청 시기를 조절할 수 있다
  });
  // 자체적으로 http 요청 전송, 데이터 가져오고 로딩상태 정보 제공
  // Tanstack Query Does Not Send HTTP Requests
  // 대신 요청을 관리, 오류 추적하는 로직을 제공, 요청 전송 코드는 직접 써야
  // axios 써도 됨

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
    // 로딩 기다리는 동안 indicator 표시
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
    // error.info가 있으면 message 사용, 없으면 기본 메시지
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
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
