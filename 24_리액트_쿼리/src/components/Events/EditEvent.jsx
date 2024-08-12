import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";

import { fetchEvent, updateEvent, queryClient } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();

  // 수정해야 할 기존 내용을 기본값 데이터로 모달창에 전달
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    // 기존 isPending, LoadingIndicator 대신 낙관적 업데이트 적용할 것
    onMutate: async (data) => {
      // mutate 호출하는 즉시(응답받기 전에) 실행
      const newEvent = data.event;

      await queryClient.cancelQueries({ queryKey: ["events", params.id] });
      // 나가는 쿼리가 있는 경우 취소
      // 해당 쿼리와 낙관적 업데이트된 쿼리 충돌 방지
      // mutation은 취소하지 않고 useQuery로 트리거된 쿼리만 취소
      const previousEvent = queryClient.getQueryData(["events", params.id]);
      // 만약 업데이트 실패할 경우? 기존 데이터와 충돌
      // 실패하면 낙관적 업데이트를 이전 데이터로 롤백해야 함

      queryClient.setQueryData(["events", params.id], newEvent);
      // 이미 저장된 데이터를 응답을 기다리지 않고 수정
      // setQueryData에 필요한 두 인수: 편집하려는 쿼리의 쿼리키, 저장하려는 새 데이터

      return { previousEvent }; // context가 이 객체가 되어 이 키를 포함함
      // onError에서 previousEvent에 액세스할 수 있음
    },

    onError: (error, data, context) => {
      queryClient.setQueryData(["events", params.id], context.previousEvent);
      // 에러 발생 시 이전 데이터로 롤백
    },
    onSettled: () => {
      // 성공 여부와 상관없이 mutation 완료될 때마다 호출
      queryClient.invalidateQueries({ queryKey: ["events", params.id] });
    },
  });

  function handleSubmit(formData) {
    mutate({
      id: params.id,
      event: formData,
    });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Failed to load event. Please check your input."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
