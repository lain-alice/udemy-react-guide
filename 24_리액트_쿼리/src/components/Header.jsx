import { useIsFetching } from "@tanstack/react-query";
// 리액트 쿼리가 앱 어딘가에서 데이터를 가져오고 있는지 확인

export default function Header({ children }) {
  const fetching = useIsFetching();
  // 리액트 쿼리가 데이터 가져오면 0 초과 숫자, 안 가져오면 0

  return (
    <>
      <div id="main-header-loading">{fetching > 0 && <progress />}</div>
      {/* html 기본 제공 진행바 */}
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
