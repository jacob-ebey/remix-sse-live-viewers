import type { LoaderFunction } from "@remix-run/node";

import { dispatchVisitorsChange, events } from "~/events.server";

export let loader: LoaderFunction = ({ request }) => {
  if (!request.signal) return new Response(null, { status: 500 });

  return new Response(
    new ReadableStream({
      start(controller) {
        let encoder = new TextEncoder();
        let handleVisitorsChanged = (liveVisitors: number) => {
          console.log({ liveVisitors });
          controller.enqueue(encoder.encode("event: message\n"));
          controller.enqueue(encoder.encode(`data: ${liveVisitors}\n\n`));
        };

        let closed = false;
        let close = () => {
          if (closed) return;
          closed = true;

          events.removeListener("visitorsChanged", handleVisitorsChanged);
          request.signal.removeEventListener("abort", close);
          controller.close();

          dispatchVisitorsChange("dec");
        };

        events.addListener("visitorsChanged", handleVisitorsChanged);
        request.signal.addEventListener("abort", close);
        if (request.signal.aborted) {
          close();
          return;
        }

        dispatchVisitorsChange("inc");
      },
    }),
    {
      headers: { "Content-Type": "text/event-stream" },
    }
  );
};
