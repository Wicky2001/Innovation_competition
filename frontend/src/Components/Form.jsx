import React,{useState} from "react";
import { useForm } from "react-hook-form";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Button,
  Text,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthProvider";


axios.defaults.withCredentials = true;
function Form() {

  const [message,setMessage]=useState("")



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

    const {authenticateObject,loginAction,registerAction,register:registerStatus,setRegister:setRegistration}=useAuth()

  const onSubmit = (data) => {

   

    if (registerStatus) {

      registerAction(data)
    } else {
   
      loginAction(data)
      
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack paddingTop={0}>
          {registerStatus && (
            <FormControl isInvalid={errors.name}>
              <FormLabel fontWeight={"400"} fontSize={"15px"}>
                Name
              </FormLabel>
              <Input
                placeholder="Enter your name"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <Text margin={0} fontSize={"14px"} color="red.500">
                  {errors.name.message}
                </Text>
              )}
            </FormControl>
          )}
          <FormControl isInvalid={errors.email}>
            <FormLabel fontWeight={"400"} fontSize={"15px"}>
              Email
            </FormLabel>
            <Input
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <Text color="red.500" margin={0} fontSize={"14px"}>
                {errors.email.message}
              </Text>
            )}
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel fontWeight={"400"} fontSize={"15px"}>
              Password
            </FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <Text color="red.500" margin={0} fontSize={"14px"}>
                {errors.password.message}
              </Text>
            )}
          </FormControl>
          <Text color="red.500" margin={0} fontSize={"14px"}>{message}</Text>
          <Divider borderColor="gray.400" />
          <Button
            leftIcon={<FcGoogle size={"25px"}></FcGoogle>}
            colorScheme="green"
            variant="outline"
            width={"100%"}
          >
            {registerStatus ? "Sign up" : "Sign in"} with Google
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            variant="solid"
            width={"100%"}
          >
            {registerStatus ? "Sign up" : "Sign in"}
          </Button>
        </VStack>
      </form>
    </>
  );
}

export default Form;
