import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      flexDirection="column"
      p={3}
      bg="white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;
