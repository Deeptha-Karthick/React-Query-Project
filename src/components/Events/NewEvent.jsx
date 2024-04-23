import { Link, useNavigate } from "react-router-dom";
import { createNewEvent } from "../../util/http.js";
import { useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";

export default function NewEvent() {
  const navigate = useNavigate();
  //useMutate doesnt run automatically. we simply give it a function to execute when called. it inturn gives us a mutate function which we can use to trigger the provided
  //on sucessfully making a post /put request using useMutation if we wanna do some action we can place it inside of onSuccess. It takes in a function
  //invalidateQueries - if we know for sure certain apis need to be retriggered and not use cache data we can use invalidateQueries
  //all queries that has ['events'] in their query key list will refetched

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData }); //when we do this, this param is automatically passed to createNewEvent
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting...."}
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed  to create event. Please check your inputs and try later"
          }
        />
      )}
    </Modal>
  );
}
