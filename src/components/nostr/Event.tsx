import { Text } from "@chakra-ui/react";
import { HIGHLIGHT, NOTE, BADGE, ZAPSTR_TRACK } from "@habla/const";

import Highlight from "./feed/Highlight";
import Note from "./Note";
import Badge from "./Badge";
import ZapstrTrack from "./ZapstrTrack";

export default function Event(props) {
  const { event } = props;
  if (event.kind === HIGHLIGHT) {
    return <Highlight {...props} maxW="586px" />;
  }

  if (event.kind === NOTE) {
    return <Note {...props} />;
  }

  if (event.kind === BADGE) {
    return <Badge {...props} />;
  }

  if (event.kind === ZAPSTR_TRACK) {
    return <ZapstrTrack {...props} />;
  }

  if (event.kind === 68002) {
    // todo
    return null;
  }

  const alt = event?.tags.find((t) => t.at(0) === "alt");
  return alt ? (
    <Text>{alt}</Text>
  ) : (
    <Text>Unknown event kind: {event.kind}</Text>
  );
}
