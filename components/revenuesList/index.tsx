import {
  Box,
  Center,
  StackProps,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/layout";
import React, { forwardRef, useState, useEffect } from "react";
import { createRevenuePayment } from "../../utils/contractCalls";
import RevenuesDetail from "../revenuesDetail";
import Button from "../button";
import { utils } from "ethers";
import styles from "../../pages/nft/[id]/manage.module.css";
// if account has fraktions.. display info to list?

const RevenuesList = ({
  account,
  revenuesCreated,
  tokenAddress,
  marketAddress,
  provider,
}) => {
  const [revenueValue, setRevenueValue] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [valueSetter, setValueSetter] = useState(false);
  // add component to deposit revenues
  // and in details, claim
  // const totalValue = (x) => utils.parseEther((x).toString());
  async function launchRevenuePayment() {
    setIsCreating(true);
    let valueIn = utils.parseEther(revenueValue.toString()); //+0.000000000001
    await createRevenuePayment(valueIn, provider, tokenAddress);
    setIsCreating(false);
    setValueSetter(false);
  }

  return (
    <div
      style={{
        borderRadius: "4px",
        borderWidth: "1px",
        borderColor: "#E0E0E0",
        padding: "16px",
        marginTop: "40px 0px",
      }}
    >
      <Box
        sx={{
          display: `flex`,
          justifyContent: `space-between`,
          alignItems: `center`,
        }}
      >
        <div
          style={{
            color: "#5A32F3",
            fontWeight: "bold",
            fontFamily: "Inter",
            fontSize: "24px",
            lineHeight: "29px",
          }}
        >
          Revenues
        </div>
        {isCreating ? (
          <div style={{ margin: "16px", fontWeight: 800, fontSize: "32px" }}>
            Creating revenue payment
          </div>
        ) : (
          <div style={{ margin: "16px" }}>
            <Text
              isOutlined
              style={{
                backgroundColor: "white",
                marginRight: "16px",
                width: "125px",
                color: `hsla(224, 86%, 51%, 1)`,
              }}
              onClick={() => setValueSetter(!valueSetter)}
            >
              {valueSetter ? "Cancel" : "Deposit Revenue"}
            </Text>
            {valueSetter && (
              <input
                style={{
                  fontSize: "48px",
                  color: "blue",
                  fontWeight: "bold",
                  textAlign: "center",
                  maxWidth: "130px",
                  marginRight: "10px",
                  marginLeft: "10px",
                  borderRadius: "8px",
                  background: "transparent",
                }}
                disabled={!tokenAddress}
                type="number"
                placeholder="ETH"
                onChange={e => {
                  setRevenueValue(e.target.value);
                }}
              />
            )}
            {valueSetter && revenueValue != 0 && (
              <Button
                isOutlined
                style={{
                  backgroundColor: "white",
                  marginRight: "16px",
                  width: "92px",
                }}
                onClick={() => launchRevenuePayment()}
              >
                {"Deposit"}
              </Button>
            )}
          </div>
        )}
      </Box>
      <div>
        {revenuesCreated && revenuesCreated.length > 0 ? (
          <div>
            <HStack>
              <div>Creator</div>
              <div>Date</div>
              <div>Total</div>
              <div>Functions</div>
            </HStack>
            {revenuesCreated.map(x => {
              return (
                <RevenuesDetail
                  account={account}
                  revenueAddress={x.id}
                  date={x.timestamp}
                  value={x.value}
                  creator={x.creator.id}
                  buyout={x.buyout}
                  provider={provider}
                  tokenAddress={x.tokenAddress}
                />
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: "24px" }}>
            There are no revenues on this NFT.
          </div>
        )}
      </div>
    </div>
  );
};
export default RevenuesList;