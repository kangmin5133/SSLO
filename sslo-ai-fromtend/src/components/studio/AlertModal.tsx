import React from "react";
import styled from "styled-components";
import iconClose from "../../assets/images/studio/icon/icon-close-studio.svg";
import {
  Button,
  Modal as Popup,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";

interface IModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  children: JSX.Element;
  removeEffect?: boolean;
  removeEffectFn?: () => Promise<void> | void;
}

const Icon = styled.img``;

const AlertModal: React.FC<IModalProps> = ({
  title,
  isOpen,
  onClose,
  loading,
  children,
}) => {
  return (
    <>
      <Popup
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalContent bgColor={"#E2E4E7"}>
          <ModalHeader
            color={"#5F6164"}
            lineHeight={"16px"}
            fontSize={"xl"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            {title}
            <Icon
              src={iconClose}
              style={{ width: 20, height: 20, cursor: "pointer" }}
              onClick={onClose}
            />
          </ModalHeader>
          <ModalBody
            display={"flex"}
            width={"full"}
            py={"12"}
            lineHeight={"14px"}
            fontSize={"md"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            {loading ? <Spinner /> : children}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3} width={"80px"} height={"35px"}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Popup>
    </>
  );
};

export default AlertModal;
