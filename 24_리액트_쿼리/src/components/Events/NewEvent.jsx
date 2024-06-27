import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// useQuery는 GET에만 사용, POST, PUT, DELETE에는 useMutation 사용

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

// 리액트 쿼리로 데이터 보내기

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    // mutate: 이 컴포넌트 어디서든 mutate 호출 가능
    // useMutation은 렌더링될 때마다 자동으로 요청 전송하지 않고 언제 실행될지 mutate로 정해줘야 함

    // mutationKey: 반드시 필요하진 않음, 변형 요청은 프론트엔드에 저장하지 않기에 캐시하지 않음
    mutationFn: createNewEvent,
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
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
