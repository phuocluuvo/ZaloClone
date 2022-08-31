import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

function MyChat({ fetchAgain, setfetchAgain }) {
  const [loggedUser, setLoggedUser] = useState(null);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      //get req
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load chats",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      py={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" spacing={0}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#e4ecfc" : "white"}
                color={"black"}
                display="flex"
                p={4}
                key={chat._id}
                transitionDuration="500ms"
                _hover={{ backgroundColor: "#f4f5f7" }}
              >
                {!chat.isGroupChat && (
                  <Avatar
                    size="md"
                    cursor="pointer"
                    my="auto"
                    mr={2}
                    name={
                      chat.users[0]._id === user._id
                        ? chat.users[1]?.pic
                        : chat.users[0]?.pic
                    }
                    src={
                      chat.users[0]._id === user._id
                        ? chat.users[1]?.pic
                        : chat.users[0]?.pic
                    }
                  />
                )}
                <Box flex={1} justifyContent="start">
                  <Box display="flex" justifyContent="space-between">
                    <Text fontSize="lg" noOfLines={[1, 2, 3]} maxW="300px">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    <Text fontSize="xs" color={"gray"}>
                      {moment(chat.latestMessage?.createdAt).calendar()}
                    </Text>
                  </Box>

                  <Text fontSize="sm" color={"gray"}>
                    {chat.isGroupChat
                      ? chat.latestMessage &&
                        `${chat.latestMessage?.sender.name}: ${chat.latestMessage?.content} `
                      : `${
                          getSender(loggedUser, chat.users) === user.name
                            ? "You: " + chat.latestMessage?.content
                            : chat.latestMessage?.content
                        }`}{" "}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChat;
