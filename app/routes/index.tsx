import { useEffect, useState } from "react";

export default function Index() {
  let [liveVisitors, setLiveVisitors] = useState("");

  useEffect(() => {
    let eventSource = new EventSource("/sse/live-visitors");
    eventSource.addEventListener("message", (event) => {
      setLiveVisitors(event.data || "unknown");
    });
  }, []);

  return (
    <main>
      <h1>Welcome to Remix</h1>
      <p>Live visitors: {liveVisitors}</p>
    </main>
  );
}
