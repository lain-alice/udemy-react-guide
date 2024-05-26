export async function fetchEvents(searchTerm) {
  let url = "http://localhost:3000/events";
  // url을 동적으로 구성

  if (searchTerm) {
    // searchTerm이 빈 문자 아니고 값 있으면

    url += "?serach=" + searchTerm;
  }

  // 검색결과 없어도 함수 호출 가능, 검색어 있으면 백엔드에 보내줌
  // 백엔드에서는 검색 결과와 맞는 결과 제공

  const response = await fetch(url);
  //  FindEventSection 요청 발생 시 쿼리 매개변수 추가
  // 그냥 하드코딩한 url을 동적인 url로 대체

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
