export async function fetchEvents({ signal, searchTerm }) {
  console.log(searchTerm);

  // console.log(searchTerm); 하면 나오는 객체... 쿼리키 정보와 요청 취소 신호 전달하는 객체
  // 요청 완료되기 전에 사용자가 나가거나 하면 리액트쿼리가 자동으로 취소해줌
  // searchTerm을 그냥 받으면 객체 채로 url에 들어감
  // 중괄호 치고 구조분해 할당으로 필요한 키의 밸류만 받아야

  let url = "http://localhost:3000/events";
  // url을 동적으로 구성

  if (searchTerm) {
    // searchTerm이 빈 문자 아니고 값 있으면

    url += "?serach=" + searchTerm;
  }

  // 검색결과 없어도 함수 호출 가능, 검색어 있으면 백엔드에 보내줌
  // 백엔드에서는 검색 결과와 맞는 결과 제공

  const response = await fetch(url, { signal: signal });
  //  FindEventSection 요청 발생 시 쿼리 매개변수 추가
  // 그냥 하드코딩한 url을 동적인 url로 대체
  // signal:signal을 전달해야 내부에서 취소 신호 받으면 요청 취소 가능

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
