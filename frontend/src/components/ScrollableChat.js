import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUserMargin,
} from "../config/ChatLogics";
import moment from "moment";
import { ChatState } from "../context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
function ScrollableChat({ messages }) {
  const { user } = ChatState();
  console.log(messages);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.name}
                hasArrow
                placeContent="bottom-start"
              >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  my="auto"
                  mr={2}
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#89F5D0"
                }`,
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                padding: "5px 20px",
                maxWidth: "75%",

                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUserMargin(messages, m, i, user._id) ? 0 : 10,
              }}
            >
              <Tooltip
                label={moment(m.createdAt).calendar()}
                hasArrow
                placeContent="left-end"
              >
                {m.content}
              </Tooltip>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
