import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// useQuery는 GET에만 사용, POST, PUT, DELETE에는 useMutation 사용

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";

// 리액트 쿼리로 데이터 보내기

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    // mutate: 이 컴포넌트 어디서든 mutate 호출 가능
    // useMutation은 렌더링될 때마다 자동으로 요청 전송하지 않고 언제 실행될지 mutate로 정해줘야 함

    // mutationKey: 반드시 필요하진 않음, 변형 요청은 프론트엔드에 저장하지 않기에 캐시하지 않음
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // 현재 표시된 컴포넌트 관련 쿼리 실행된 경우 특정 쿼리로 가져온 데이터 만료 후 즉시 다시 가져오기
      // events가 포함된 모든 쿼리 키 무료화
      // exact: true 하면 정확히 일치하는 쿼리만 무효화
      navigate("/events");
    },

    // 리액트 쿼리가 다른 페이지 갔다오면 자동으로 refetch하게 됨
    // 새 이벤트 추가된 게 확실하면 즉시 업데이트하게 하려면?
    // 데이터 하나가 오래되어 다시 가져와야 한다는 걸 리액트 쿼리에 알려줘야
    // App.jsx의 QueryClient를 http.js로 옮김, 여기서도 쓸 수 있음
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
    // navigate("/events"); 여기다 navigate하면 변형 되든말든 무조건 페이지 나감
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={error.info?.message || "Failed to created event."}
        />
      )}
    </Modal>
  );
}
