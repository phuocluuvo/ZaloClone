import { ArrowBackIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderInfo } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import io from "socket.io-client";
import animationData from "../animations/52671-typing-animation-in-chat.json";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [hoverring, setHoverring] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to send message",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      setFetchAgain(!fetchAgain);
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send message",
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    //if user is typing
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timerDiff = timeNow - lastTypingTime;
      if (timerDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  console.log(notification);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <div style={{ width: "100%", padding: "7px 5px" }}>
            <Text
              fontSize={{ base: "18px", md: "20px" }}
              fontWeight="bold"
              w="100%"
              display="flex"
              alignContent="center"
              fontFamily="Work Sans"
            >
              <IconButton
                bg="white"
                ml={5}
                mr={2}
                my={2}
                w="30px"
                h="30px"
                borderRadius="full"
                display={{ base: "flex", md: "none" }}
                icon={<ChevronLeftIcon />}
                size="12px"
                onClick={() => setSelectedChat("")}
              />
              <Box>
                {selectedChat.isGroupChat === false && (
                  <Avatar
                    size="md"
                    cursor="pointer"
                    my="auto"
                    mr={2}
                    name={
                      selectedChat.users[0]._id === user._id
                        ? selectedChat.users[1]?.pic
                        : selectedChat.users[0]?.pic
                    }
                    src={
                      selectedChat.users[0]._id === user._id
                        ? selectedChat.users[1]?.pic
                        : selectedChat.users[0]?.pic
                    }
                  />
                )}
                {!selectedChat.isGroupChat ? (
                  <>
                    <ProfileModal
                      user={getSenderInfo(user, selectedChat.users)}
                    >
                      {getSender(user, selectedChat.users)}
                    </ProfileModal>
                  </>
                ) : (
                  <div
                    onMouseEnter={() => setHoverring(true)}
                    onMouseLeave={() => setHoverring(false)}
                  >
                    {selectedChat.chatName}
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    >
                      <i
                        class="fa fa-pen"
                        style={{
                          display: hoverring ? "" : "none",
                          fontSize: "15px",
                          padding: "5px",
                          borderRadius: "100%",
                          backgroundColor: "lightgray",
                        }}
                        aria-hidden="true"
                      ></i>
                    </UpdateGroupChatModal>
                  </div>
                )}
              </Box>
            </Text>
            {selectedChat.isGroupChat && (
              <Text
                fontSize="md"
                flex="1"
                justifySelf="center"
                alignSelf="self-start"
                ml={{ base: 14, md: 0 }}
                mb={{ base: 3, md: 0 }}
              >
                {selectedChat.users.length}{" "}
                <i className="far fa-user" style={{ fontSize: "15px" }}></i>
              </Text>
            )}
          </div>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" m="auto" />
            ) : (
              <Box
                display="flex"
                overflowY="scroll"
                flexDir="column"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  someone is typing
                  <span>
                    <Lottie
                      width={30}
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                        rendererSettings: {
                          preserveAspectRatio: "xMidYMid slice",
                        },
                      }}
                      style={{
                        marginBottom: 15,
                        marginLeft: 0,
                      }}
                    />
                  </span>
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E8E8E8"
                placeholder="Enter your message here..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text color="black" fontSize="3xl" pb={3} fontFamily="Work Sans">
            Choose a chat to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
