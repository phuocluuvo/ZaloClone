import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";

function UserBadgeItem({ _user, handleFunction }) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      display="flex"
      alignItems="center"
      justifyItems="center"
      variant="solid"
      fontSize={12}
      textColor="white"
      cursor="pointer"
      onClick={handleFunction}
      bg={`red `}
    >
      {_user?.name}
      <CloseIcon pl={1} />
    </Box>
  );
}

export default UserBadgeItem;
