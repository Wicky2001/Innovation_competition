import React from "react";
import Form from "./Form";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  CardFooter,
  Heading,
  Container,
  Image,
  Link,
  Flex,
} from "@chakra-ui/react";

import logo from "./Assects/logo.png";

function Login() {
  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Container centerContent maxW="450px">
        <Card width={"100%"}>
          <CardHeader align="center">
            <Image
              borderRadius="full"
              boxSize="60px"
              src={logo}
              alt="Dan Abramov"
              marginBottom={5}
            />
            <Heading
              size={"32px"}
              fontWeight={"500"}
              fontFamily={"Roboto"}
              margin={0}
            >
              Login to your account
            </Heading>
            <Text fontSize={"16px"} paddingTop={0.2}>
              Let's mark your papers.
            </Text>
          </CardHeader>
          <CardBody paddingTop={6}>
            <Form></Form>
          </CardBody>
          <CardFooter paddingY={0}>
            <Text fontSize={"13px"}>
              Don't have an account? <Link color={"green"}>Sign up</Link>
            </Text>
          </CardFooter>
        </Card>
      </Container>
    </Flex>
  );
}

export default Login;
