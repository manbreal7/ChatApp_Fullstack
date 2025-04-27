import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import {
    SimpleDateAndTime,
    SimpleDateMonthDay,
    SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
    const chatBox = useRef();
    const adminId = useSelector((store) => store.auth?._id);
    const isTyping = useSelector((store) => store?.condition?.isTyping);
    const [scrollShow, setScrollShow] = useState(true);
    // Handle Chat Box Scroll Down
    const handleScrollDownChat = () => {
        if (chatBox.current) {
            chatBox.current.scrollTo({
                top: chatBox.current.scrollHeight,
                // behavior: "auto",
            });
        }
    };
    // Scroll Button Hidden
    useEffect(() => {
        handleScrollDownChat();
        if (chatBox.current.scrollHeight == chatBox.current.clientHeight) {
            setScrollShow(false);
        }
        const handleScroll = () => {
            const currentScrollPos = chatBox.current.scrollTop;
            if (
                currentScrollPos + chatBox.current.clientHeight <
                chatBox.current.scrollHeight - 30
            ) {
                setScrollShow(true);
            } else {
                setScrollShow(false);
            }
        };
        const chatBoxCurrent = chatBox.current;
        chatBoxCurrent.addEventListener("scroll", handleScroll);
        return () => {
            chatBoxCurrent.removeEventListener("scroll", handleScroll);
        };
    }, [allMessage, isTyping]);

    return (
        <>
            {scrollShow && (
                <div
                    className="absolute bottom-16 right-4 cursor-pointer z-20 font-light text-white/50 bg-black/80 hover:bg-black hover:text-white p-1.5 rounded-full"
                    onClick={handleScrollDownChat}
                >
                    <CgChevronDoubleDown title="Scroll Down" fontSize={24} />
                </div>
            )}
            <div
                className="flex flex-col w-full px-3 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[66vh]"
                ref={chatBox}
            >
                {allMessage?.map((message, idx) => {
                    return (
                        <Fragment key={message._id}>
                            <div className="sticky top-0 flex w-full justify-center z-10">
                                {new Date(
                                    allMessage[idx - 1]?.updatedAt
                                ).toDateString() !==
                                    new Date(
                                        message?.updatedAt
                                    ).toDateString() && (
                                        <span className="text-xs font-light mb-2 mt-1 text-white/50 bg-black h-7 w-fit px-5 rounded-md flex items-center justify-center cursor-pointer">
                                            {SimpleDateMonthDay(message?.updatedAt)}
                                        </span>
                                    )}
                            </div>
                            <div
                                className={`flex items-start gap-1 ${message?.sender?._id === adminId
                                    ? "flex-row-reverse text-white"
                                    : "flex-row text-black"
                                    }`}
                            >
                                {message?.chat?.isGroupChat &&
                                    message?.sender?._id !== adminId &&
                                    (allMessage[idx + 1]?.sender?._id !==
                                        message?.sender?._id ? (
                                        <img
                                            src={message?.sender?.image}
                                            alt=""
                                            className="h-9 w-9 rounded-full"
                                        />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full"></div>
                                    ))}
                                <div
                                    className={`${message?.sender?._id === adminId
                                        ? "bg-blue-400 rounded-s-lg rounded-ee-2xl"
                                        : "bg-gray-500 rounded-e-lg rounded-es-2xl"
                                        } py-1.5 px-2 min-w-10 text-start flex flex-col relative max-w-[85%]`}
                                >
                                    {message?.chat?.isGroupChat &&
                                        message?.sender?._id !== adminId && (
                                            <span className="text-xs font-bold text-start text-gray-200">
                                                {message?.sender?.firstName}
                                            </span>
                                        )}
                                    <div
                                        className={`mt-1 pb-1.5 ${message?.sender?._id == adminId
                                            ? "pr-16"
                                            : "pr-12"
                                            } ${message?.media ? "" : ""}`}
                                    >
                                        <span>
                                            {message?.media ? (
                                                message?.media?.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                        src={message.media}
                                                        controls
                                                        className="rounded-md max-w-xs max-h-72"
                                                    />
                                                ) : (
                                                    <img
                                                        src={message.media}
                                                        alt="uploaded"
                                                        className="rounded-md max-w-xs max-h-72 object-cover"
                                                    />
                                                )
                                            ) : (
                                                <span>{message?.message}</span>
                                            )}

                                        </span>
                                        <span
                                            className="text-[11px] font-white absolute bottom-0 right-2 flex items-end gap-1.5"
                                            title={SimpleDateAndTime(
                                                message?.updatedAt
                                            )}
                                        >
                                            {SimpleTime(message?.updatedAt)}
                                            {message?.sender?._id ===
                                                adminId && (
                                                    <VscCheckAll
                                                        color="white"
                                                        fontSize={16}
                                                    />
                                                )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
                {isTyping && (
                    <div id="typing-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllMessages;
