import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import SignUp from "../components/Authentication/SignUp";

import SignIn from "../components/Authentication/SignIn";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigator = useNavigate();
  useEffect(() => {
    //fecth local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) navigator("/chats");
  }, [navigator]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bgColor="white"
        textColor="#000000"
        borderRadius="lg"
        borderWidth="1px"
        w="100%"
        m="40px 0 15px 0"
        textAlign="center"
      >
        <Text fontSize="4xl" fontFamily="Work Sans">
          CHAT-CHIT
        </Text>
      </Box>
      <Box bg="white" w="100%" p="10px" borderRadius="lg">
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab w="50%">Sign In</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SignIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
