import { Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "../Header.jsx";

import { fetchEvent } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event", { id: 1 }],
    queryFn: fetchEvent,
    stateTime: 5000,
  });

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  if (data) {
    content = (
      {data.map((event) => (
        <article className="event-details" key={event.id}>
        
        <header>
          <h1>{event.title}</h1>
          <nav>
            <button>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div className="event-details-content">
          <img src={`http://localhost:3000/events/${id}/${event.image}`} alt={event.title} />
          <div className="event-details-info">
            <div>
              <p className="event-details-location">{event.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate}</time>
            </div>
            <p className="event-details-description">{event.description}</p>
          </div>
        </div>
      </article>
      ))}
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
