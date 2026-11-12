import { Work, type WorkItem } from "@/components/sections/work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internal AI Tool",
  description:
    "Screens from Keychain's internal AI agent platform, with names and customer details blurred.",
};

const data: WorkItem[] = [
  { src: "/internal-tool/login.webp", title: "Sign in" },
  { src: "/internal-tool/chat.webp", title: "Chat", description: "Describe a workflow in plain English" },
  { src: "/internal-tool/chat-flow.webp", title: "Chat on a flow", description: "The agent asks before it turns anything on" },
  { src: "/internal-tool/flows.webp", title: "Flows", description: "Every workflow and how it ran today" },
  { src: "/internal-tool/flow.webp", title: "Flow", description: "A workflow's graph, gates and spend" },
  { src: "/internal-tool/activity.webp", title: "Activity", description: "Every run, grouped by day" },
  { src: "/internal-tool/run-recap.webp", title: "Run trace", description: "What a run sent to Slack" },
  { src: "/internal-tool/run-nudge.webp", title: "Run trace", description: "Slack buttons and the responses to them" },
  { src: "/internal-tool/run-email.webp", title: "Run trace", description: "An email sent from the owner's inbox" },
  { src: "/internal-tool/profile.webp", title: "Profile", description: "Spend, runs and tool use per person" },
];

export default function InternalToolPage() {
  return <Work title="Internal AI Tool" slug="internal-tool" data={data} />;
}
