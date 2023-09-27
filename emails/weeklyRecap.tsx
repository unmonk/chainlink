import { Pick } from "@/drizzle/schema";
import { Button } from "@react-email/button";
import {
  Body,
  Container,
  Heading,
  Hr,
  Link,
  Section,
} from "@react-email/components";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import * as React from "react";

interface WeeklyRecapProps {
  username: string;
  picks?: Pick[];
}

export default function HelloEmail({ username, picks }: WeeklyRecapProps) {
  return (
    <Html>
      <Body style={main}>
        <Section style={header}></Section>
        <Container style={container}>
          <Text style={challengeLink}>
            <Link style={link} href="https://chainlink.st/u/">
              View your profile {username}
            </Link>
          </Text>

          <Heading style={heading}>
            <strong>Your weekly ChainLink recap:</strong>
          </Heading>
          <Text style={paragraph}>
            <strong>Thank you for playing!</strong> Here are your picks for the
            past week.
          </Text>
          <Text style={paragraph}>
            <strong>Picks: </strong>0
            <br />
            <strong>Wins: </strong>0
            <br />
            <strong>Losses: </strong>0
          </Text>
          <Hr style={hr} />

          {/* <Container style={container}>
            <Section style={picksContainer}>
              <table>
                <tr>
                  <th>Pick</th>
                  <th>Result</th>
                </tr>
                <tr>
                  <td>placeholder</td>
                  <td>placeholder</td>
                </tr>
              </table>
            </Section>
          </Container> */}

          <Container>
            {picks?.length && picks.length > 0 ? (
              <Container></Container>
            ) : (
              <Text>
                No Picks Made.{" "}
                <Link href="https://chainlink.st/play" style={link}>
                  Play Now
                </Link>
              </Text>
            )}
          </Container>
        </Container>
      </Body>
    </Html>
  );
}

const picksContainer = {
  background: "#3B8F24",
  padding: "30px",
  color: "#191919",
  fontWeight: "400",
  marginBottom: "0",
  textAlign: "center" as const,
};

const main = {
  fontFamily: '"Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
  backgroundColor: "#505050",
  textAlign: "center" as const,
  margin: "0",
};

const header = {
  width: "100%",
  backgroundColor: "#191919",
  margin: "0 auto",
  paddingBottom: "30px",
  zIndex: "999",
};
const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto 0 auto",
  width: "648px",
  maxWidth: "648px",
  position: "relative" as const,
};

const cubeText = { fontSize: "32px", margin: "4px 0 0 0" };

const box = {
  padding: "0 48px",
};

const challengeLink = {
  backgroundColor: "#505050",
  textAlign: "center" as const,
  padding: "10px 0 25px 0",
  fontSize: "13px",
  position: "absolute" as const,
  width: "100%",
  maxWidth: "648px",
  top: "-28px",
  margin: "0 0 16px 0",
};

const link = {
  color: "#3B8F24",
  cursor: "pointer",
};

const heading = {
  background: "#3B8F24",
  padding: "30px",
  color: "#191919",
  fontWeight: "400",
  marginBottom: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "white",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
