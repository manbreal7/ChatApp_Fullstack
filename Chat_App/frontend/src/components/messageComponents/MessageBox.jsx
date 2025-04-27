import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Card } from "reactstrap";
import { setChatDetailsBox, setMessageLoading } from "../../redux/slices/conditionSlice";
import { addAllMessages } from "../../redux/slices/messageSlice";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import AllMessages from "./AllMessages";
import MessageSend from "./MessageSend";
import MessageLoading from "../loading/MessageLoading";
import getChatName, { getChatImage } from "../../utils/getChatName";
import ChatDetailsBox from "../chatDetails/ChatDetailsBox";
import { CiMenuKebab, CiSettings } from "react-icons/ci";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

const MessageBox = ({ chatId }) => {
    const dispatch = useDispatch();
    const chatDetailsBox = useRef(null);
    const [isExiting, setIsExiting] = useState(false);
    const isChatDetailsBox = useSelector((store) => store?.condition?.isChatDetailsBox);
    const isMessageLoading = useSelector((store) => store?.condition?.isMessageLoading);
    const allMessage = useSelector((store) => store?.message?.message);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const authUserId = useSelector((store) => store?.auth?._id);

    useEffect(() => {
        const getMessage = (chatId) => {
            dispatch(setMessageLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message/${chatId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addAllMessages(json?.data || []));
                    dispatch(setMessageLoading(false));
                    socket.emit("join chat", selectedChat._id);
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setMessageLoading(false));
                    toast.error("Message Loading Failed");
                });
        };
        getMessage(chatId);
    }, [chatId]);

    // Handle outside click for Chat Details
    const handleClickOutside = (event) => {
        if (chatDetailsBox.current && !chatDetailsBox.current.contains(event.target)) {
            setIsExiting(true);
            setTimeout(() => {
                dispatch(setChatDetailsBox(false));
                setIsExiting(false);
            }, 500);
        }
    };

    useEffect(() => {
        if (isChatDetailsBox) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isChatDetailsBox]);

    return (
        <Container fluid className="p-0">
            <Card className="py-2.5 px-4 d-flex flex-row justify-content-between align-items-center bg-dark text-white">
                <Row className="w-100 d-flex flex-row justify-content-between align-items-center">
                    <Col xs="auto" className="d-flex align-items-center">
                        <Button color="secondary" className="d-sm-none me-2" onClick={() => dispatch(addSelectedChat(null))}>
                            <FaArrowLeft />
                        </Button>
                        <img src={getChatImage(selectedChat, authUserId)} alt="chat" className="rounded-circle me-2" width="40" height="40" />
                        <h5 className="m-0">{getChatName(selectedChat, authUserId)}</h5>
                    </Col>
                    <Col xs="auto">
                        <CiSettings fontSize={30} className="cursor-pointer" onClick={() => dispatch(setChatDetailsBox(true))} />
                    </Col>
                </Row>
            </Card>

            {isChatDetailsBox && (
                <div className={`position-absolute w-100 max-w-96 top-14 end-12 z-20 ${isExiting ? "fade-out" : "fade-in"}`}>
                    <div ref={chatDetailsBox} className="border bg-dark rounded-lg p-3">
                        <ChatDetailsBox />
                    </div>
                </div>
            )}

            {isMessageLoading ? <MessageLoading /> : <AllMessages allMessage={allMessage} />}
            <MessageSend chatId={chatId} />
        </Container>
    );
};

export default MessageBox;
