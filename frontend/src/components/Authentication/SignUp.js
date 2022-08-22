import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  let navigate = useNavigate();

  function postDetails(pics) {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select a picture",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-chit");
      data.append("cloud_name", "voluu");
      fetch("https://api.cloudinary.com/v1_1/voluu/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select a (another) picture",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }
  const submitHanler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "The passwords do not match",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Sign up successfully",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Sign up failed",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack spacing="10px">
      <FormControl isRequired id="name">
        <FormLabel>User Name</FormLabel>
        <Input
          placeholder="Enter your username"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired id="email">
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Your Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your avatar</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p="1.5"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        onClick={submitHanler}
        mt="15"
        colorScheme="blue"
        w="100%"
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default SignUp;
