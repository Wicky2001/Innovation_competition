import React from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Button,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

function Form() {
  return (
    <>
      <VStack>
        <FormControl>
          <FormLabel fontWeight={"400"} fontSize={"15px"}>
            Email
          </FormLabel>
          <Input placeholder="Email" type="email" />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={"400"} fontSize={"15px"}>
            Password
          </FormLabel>
          <Input type="password" placeholder="Password" />
        </FormControl>
        <Divider borderColor="gray.400" />
        <Button
          leftIcon={<FcGoogle size={"25px"}></FcGoogle>}
          colorScheme="green"
          variant="outline"
          width={"100%"}
        >
          Sign in with google
        </Button>
        <Button colorScheme="green" variant="solid" width={"100%"}>
          Sign in
        </Button>
      </VStack>
    </>
  );
}

export default Form;
